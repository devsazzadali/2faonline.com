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
    return saved ? JSON.parse(saved) : [];
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

  // হিস্ট্রি আপডেট ফাংশন
  const addToHistory = (rawEntry) => {
    const formattedEntry = {
      name: rawEntry.name || 'Untitled Account',
      timeAgo: 'Just now',
      maskedKey: rawEntry.secret 
        ? `${rawEntry.secret.substring(0, 4)}****${rawEntry.secret.slice(-2)}` 
        : '**** ****',
      addedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistoryList(prev => {
      const updated = [formattedEntry, ...prev].slice(0, 20);
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

      {/* হিরো সেকশনের নিচে ৩ কলামের হিস্ট্রি গ্রিড */}
      {showHistory && <History historyData={historyList} />}

      <Ads />
      <FAGen />
      <End/>
    </div>
  )
}

export default App;