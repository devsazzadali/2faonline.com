import React, { useState, useEffect } from 'react';
import './FAGen.css';

const Authenticator = () => {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('2fa_accounts_v1');
    return saved
      ? JSON.parse(saved)
      : [{ id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }];
  });

  const [timeLeft, setTimeLeft] = useState(30);
  const [otplibLoaded, setOtplibLoaded] = useState(false);

  // otplib লোড হয়েছে কিনা চেক করা
  useEffect(() => {
    const check = () => {
      if (window.otplib?.authenticator?.generate) {
        setOtplibLoaded(true);
      }
    };

    check();
    if (!otplibLoaded) {
      const timer = setInterval(check, 200);
      return () => clearInterval(timer);
    }
  }, [otplibLoaded]);

  // localStorage-এ সেভ করা
  useEffect(() => {
    localStorage.setItem('2fa_accounts_v1', JSON.stringify(accounts));
  }, [accounts]);

  // TOTP কোড এবং টাইমার আপডেট (প্রতি সেকেন্ডে)
  useEffect(() => {
    if (!otplibLoaded) return;

    const updateCodes = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setTimeLeft(remaining > 0 ? remaining : 30);

      setAccounts(prevAccounts => {
        const updated = prevAccounts.map(acc => {
          const secret = acc.secret.replace(/\s+/g, '').toUpperCase();
          if (secret.length >= 16) {
            try {
              const token = window.otplib.authenticator.generate(secret);
              return { ...acc, code: token, active: true };
            } catch (e) {
              return { ...acc, code: 'ERROR', active: false };
            }
          }
          return { ...acc, code: '------', active: false };
        });

        // শুধু কোড চেঞ্জ হলে আপডেট করো (loop এড়ানোর জন্য)
        const prevCodes = prevAccounts.map(a => a.code);
        const newCodes = updated.map(a => a.code);
        return JSON.stringify(prevCodes) === JSON.stringify(newCodes) ? prevAccounts : updated;
      });
    };

    updateCodes();
    const interval = setInterval(updateCodes, 1000);
    return () => clearInterval(interval);
  }, [otplibLoaded]); // শুধু otplib লোড হলে চালু হবে

  const addAccount = () => {
    setAccounts([
      ...accounts,
      { id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }
    ]);
  };

  const removeAccount = (id) => {
    const filtered = accounts.filter(acc => acc.id !== id);
    setAccounts(filtered.length > 0
      ? filtered
      : [{ id: Date.now(), name: '', secret: '', code: '------', active: false, showSecret: false }]
    );
  };

  const toggleSecretVisibility = (id) => {
    setAccounts(accounts.map(a =>
      a.id === id ? { ...a, showSecret: !a.showSecret } : a
    ));
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert(`Copied: ${code}`);
    } catch (err) {
      alert('Copy failed – ম্যানুয়ালি কপি করো।');
    }
  };

  const hasActiveAccount = accounts.some(acc => acc.active);

  if (!otplibLoaded) {
    return (
      <div className="auth-container">
        <p>Loading authenticator library...</p>
      </div>
    );
  }

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
                placeholder="e.g., Google, GitHub (optional)"
                value={acc.name}
                onChange={(e) =>
                  setAccounts(accounts.map(a => a.id === acc.id ? { ...a, name: e.target.value } : a))
                }
              />
            </div>

            <div className="field-group">
              <label className="label-text">Secret Key</label>
              <div className="secret-input-wrapper">
                <input
                  className="input-box"
                  type={acc.showSecret ? "text" : "password"}
                  placeholder="Paste your secret key here..."
                  value={acc.secret}
                  onChange={(e) =>
                    setAccounts(accounts.map(a => a.id === acc.id ? { ...a, secret: e.target.value } : a))
                  }
                />
                {/* <button
                  type="button"
                  className="icon-btn"
                  onClick={() => toggleSecretVisibility(acc.id)}
                  style={{ marginLeft: '8px' }}
                >
                  {acc.showSecret ? '👁️' : '👁️‍🗨️'}
                </button> */}
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
                    <button className="icon-btn" onClick={() => copyToClipboard(acc.code)}>
                      Copy
                    </button>
                  </>
                ) : (
                  <span className="enter-secret-label">Enter Valid Secret</span>
                )}
              </div>
            </div>

            <button className="del-btn" onClick={() => removeAccount(acc.id)}>
              <span style={{ color: '#f87171', marginRight: '5px' }}>🗑</span> Remove
            </button>
          </div>
        ))}
      </div>

      {hasActiveAccount && (
        <div className="bottom-timer">
          <div className="timer-wrapper">
            <span style={{ fontSize: '20px' }}>⏱</span>
            <div className="timer-info">
              <div className="time-digit"><strong>{timeLeft}s</strong></div>
              <div className="time-sub">until next refresh</div>
            </div>
            <div className="progress-bg">
              <div
                className="progress-fill"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
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