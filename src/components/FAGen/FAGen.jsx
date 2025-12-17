import React, { useState, useEffect } from 'react';
import './FAGen.css';

const Authenticator = () => {
  // localStorage থেকে ডাটা লোড করা
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('2fa_accounts_v1');
    return saved ? JSON.parse(saved) : [{ id: Date.now(), name: '', secret: '', code: '------', active: false }];
  });

  const [timeLeft, setTimeLeft] = useState(30);

  // ব্রাউজারে ডাটা সেভ করা
  useEffect(() => {
    localStorage.setItem('2fa_accounts_v1', JSON.stringify(accounts));
  }, [accounts]);

  // TOTP জেনারেশন লজিক (আপনার দেওয়া ফাংশনগুলো এখানে)
  const base32toHex = (base32) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '', hex = '';
    base32 = base32.toUpperCase().replace(/=+$/, '');
    for (let i = 0; i < base32.length; i++) {
      const val = alphabet.indexOf(base32.charAt(i));
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    for (let i = 0; i + 4 <= bits.length; i += 4) { hex += parseInt(bits.substr(i, 4), 2).toString(16); }
    return hex;
  };

  const hexToUint8 = (hex) => {
    if (hex.length % 2) hex = '0' + hex;
    const arr = new Uint8Array(hex.length / 2);
    for (let i = 0; i < arr.length; i++) arr[i] = parseInt(hex.substr(i * 2, 2), 16);
    return arr;
  };

  const generateTOTP = async (secret) => {
    try {
      if (!secret || secret.length < 8) return '------';
      const keyHex = base32toHex(secret);
      const epoch = Math.floor(Date.now() / 1000);
      const counter = Math.floor(epoch / 30);
      const counterHex = counter.toString(16).padStart(16, '0');
      
      const key = hexToUint8(keyHex);
      const msg = hexToUint8(counterHex);
      const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
      const sig = await crypto.subtle.sign('HMAC', cryptoKey, msg);
      const sigArr = new Uint8Array(sig);
      
      const offset = sigArr[sigArr.length - 1] & 0xf;
      const binary = ((sigArr[offset] & 0x7f) << 24) | ((sigArr[offset + 1] & 0xff) << 16) | ((sigArr[offset + 2] & 0xff) << 8) | (sigArr[offset + 3] & 0xff);
      return (binary % 1000000).toString().padStart(6, '0');
    } catch (e) { return 'ERROR'; }
  };

  // মেইন রিফ্রেশ লুপ
  useEffect(() => {
    const updateCodes = async () => {
      const now = Math.floor(Date.now() / 1000);
      setTimeLeft(30 - (now % 30));

      const updatedAccounts = await Promise.all(accounts.map(async (acc) => {
        if (acc.secret.trim().length >= 8) {
          const newCode = await generateTOTP(acc.secret.replace(/\s+/g, ''));
          return { ...acc, code: newCode, active: true };
        }
        return { ...acc, code: '------', active: false };
      }));

      // শুধুমাত্র যদি কোড পরিবর্তন হয় তবেই স্টেট আপডেট হবে
      if (JSON.stringify(updatedAccounts) !== JSON.stringify(accounts)) {
        setAccounts(updatedAccounts);
      }
    };

    const timer = setInterval(updateCodes, 1000);
    return () => clearInterval(timer);
  }, [accounts]);

  const addAccount = () => {
    setAccounts([...accounts, { id: Date.now(), name: '', secret: '', code: '------', active: false }]);
  };

  const removeAccount = (id) => {
    const filtered = accounts.filter(acc => acc.id !== id);
    setAccounts(filtered.length > 0 ? filtered : [{ id: Date.now(), name: '', secret: '', code: '------', active: false }]);
  };

  const hasSecret = accounts.some(acc => acc.secret.trim().length >= 8);

  return (
    <div className="auth-container">
      <div className="card-grid">
        {accounts.map((acc) => (
          <div key={acc.id} className="auth-card">
            <div className="field-group">
              <label className="label-text">Account Name</label>
              <input 
                className="input-box" 
                type="text" 
                placeholder="e.g., Facebook, Google (optional)"
                value={acc.name}
                onChange={(e) => setAccounts(accounts.map(a => a.id === acc.id ? {...a, name: e.target.value} : a))}
              />
            </div>

            <div className="field-group">
              <label className="label-text">Secret Key</label>
              <div className="secret-input-wrapper">
                <input 
                  className="input-box" 
                  type="password" 
                  placeholder="Paste your secret key here..."
                  value={acc.secret}
                  onChange={(e) => setAccounts(accounts.map(a => a.id === acc.id ? {...a, secret: e.target.value} : a))}
                />
              </div>
            </div>

            <div className="code-box">
              <div className={`otp-code ${acc.active ? 'active-blue' : 'inactive-gray'}`}>
                {acc.code}
              </div>
              <div className="status-row">
                {acc.active ? (
                  <>
                    <span className="status-badge">Active</span>
                    <button className="icon-btn" onClick={() => navigator.clipboard.writeText(acc.code)}>Copy</button>
                  </>
                ) : (
                  <button className="enter-secret-label">Enter Secret</button>
                )}
              </div>
            </div>

            <button className="del-btn" onClick={() => removeAccount(acc.id)}>
              <span style={{color: '#f87171', marginRight: '5px'}}>🗑</span> Remove
            </button>
          </div>
        ))}
      </div>

      {hasSecret && (
        <div className="bottom-timer">
          <div className="timer-wrapper">
            <span style={{fontSize: '20px'}}>⏱</span>
            <div className="timer-info">
              <div className="time-digit"><strong>{timeLeft}s</strong></div>
              <div className="time-sub">until next refresh</div>
            </div>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
            </div>
          </div>
        </div>
      )}

      <button className="add-more-btn" onClick={addAccount}>
        <strong>+</strong> Add Another Account
      </button>
    </div>
  );
};

export default Authenticator;