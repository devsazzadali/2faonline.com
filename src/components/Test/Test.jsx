import React, { useEffect, useState } from 'react';

const UserHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // ১. আগের সেভ করা হিস্ট্রি গেট করা
    const storedHistory = JSON.parse(localStorage.getItem('user_visit_history')) || [];
    
    // ২. বর্তমান পেজ এবং সময় ডাটা তৈরি
    const currentVisit = {
      path: window.location.pathname,
      timestamp: new Date().getTime(),
      dateString: new Date().toLocaleDateString()
    };

    // ৩. নতুন ডাটা যোগ করা
    const updatedHistory = [...storedHistory, currentVisit];

    // ৪. ৭ দিনের পুরনো ডাটা ফিল্টার করে বাদ দেওয়া
    const sevenDaysAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
    const filteredHistory = updatedHistory.filter(item => item.timestamp > sevenDaysAgo);

    // ৫. LocalStorage এ সেভ করা
    localStorage.setItem('user_visit_history', JSON.stringify(filteredHistory));
    setHistory(filteredHistory);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h3>আপনার গত ৭ দিনের ভিজিট হিস্ট্রি:</h3>
      <ul style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px' }}>
        {history.map((item, index) => (
          <li key={index} style={{ marginBottom: '8px', fontSize: '14px' }}>
            <strong>পেজ:</strong> {item.path} | <strong>সময়:</strong> {item.dateString}
          </li>
        ))}
        {history.length === 0 && <p>কোনো হিস্ট্রি পাওয়া যায়নি।</p>}
      </ul>
    </div>
  );
};

export default UserHistory;