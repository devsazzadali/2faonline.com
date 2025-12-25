import React, { useState, useEffect } from 'react'
import Header from './components/Header/Header.jsx'
import Hero from './components/Hero/Hero.jsx'
import History from './components/History/History.jsx'
import Ads from './components/Ads/Ads.jsx'
import FAGen from './components/FAGen/FAGen.jsx'
import End from './components/End/End.jsx'

const App = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  
  const [historyList, setHistoryList] = useState(() => {
    const saved = localStorage.getItem('2fa_history');
    const parsed = saved ? JSON.parse(saved) : [];
    
    // পেজ লোড হওয়ার সময় ৭ দিনের পুরনো ডাটা ফিল্টার করা
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return parsed.filter(item => item.timestamp > sevenDaysAgo);
  });

  // থিম কন্ট্রোল
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // হিস্ট্রি আপডেট ফাংশন (FAGen থেকে ডাটা এখানে আসবে)
  const addToHistory = (rawEntry) => {
    if(!rawEntry.secret) return; // সিক্রেট না থাকলে সেভ করার দরকার নেই

    const formattedEntry = {
      name: rawEntry.name || 'Untitled Account',
      timestamp: Date.now(), // ৭ দিন হিসেব করার জন্য
      maskedKey: `${rawEntry.secret.substring(0, 4)}****${rawEntry.secret.slice(-4)}`,
      addedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now'
    };

    setHistoryList(prev => {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      // নতুনটি যোগ করা এবং সাথে সাথে ৭ দিনের পুরনো ডাটা মুছে ফেলা
      const updated = [formattedEntry, ...prev].filter(item => item.timestamp > sevenDaysAgo);
      localStorage.setItem('2fa_history', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="app-container">
      <Header 
        onHistoryClick={() => setShowHistory(!showHistory)} 
        historyCount={historyList.length} 
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        onRefresh={() => window.location.reload()}
      />
      
      <Hero onCodeGenerate={addToHistory} />

      {/* হিস্ট্রি সেকশন */}
      {showHistory && <History historyData={historyList} />}

      <Ads />

      {/* FAGen-এ ডিলিট ফাংশনালিটি পাস করা হলো */}
      <FAGen onAccountDeleted={addToHistory} />
      
      <End/>
    </div>
  )
}

export default App;