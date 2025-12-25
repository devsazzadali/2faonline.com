import React from 'react';
import './History.css'; // নিশ্চিত হয়ে নিন এই ফাইলটি আপনার ফোল্ডারে আছে

const History = ({ historyData }) => {
  return (
    <div className="history-container">
      {/* হেডার সেকশন */}
      <div className="history-header-main">
        <span className="history-clock-icon">⏱</span>
        <h3 className="history-title">Recent Deleted Keys (Last 7 Days)</h3>
      </div>
      
      {/* হিস্ট্রি কার্ড গ্রিড */}
      <div className="card-grid"> {/* আপনার দেওয়া মেইন গ্রিড ক্লাস ব্যবহার করা হয়েছে */}
        {historyData.length > 0 ? (
          historyData.map((item, index) => (
            <div key={index} className="auth-card" style={{ opacity: 0.85 }}>
              <div className="hist-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong className="hist-acc-name" style={{ color: '#374151', fontSize: '15px' }}>
                  {item.name || 'Unnamed Account'}
                </strong>
                <span className="hist-time-tag" style={{ fontSize: '11px', color: '#6b7280', background: '#f3f4f6', padding: '2px 10px', borderRadius: '20px' }}>
                  {item.timeAgo || 'Just now'}
                </span>
              </div>
              
              <div className="hist-masked-key" style={{ fontFamily: 'monospace', color: '#2563eb', fontSize: '14px', marginBottom: '10px', letterSpacing: '1px' }}>
                {item.maskedKey}
              </div>
              
              <div className="hist-added-date" style={{ fontSize: '11px', color: '#9ca3af' }}>
                Deleted at: {item.addedTime}
              </div>
            </div>
          ))
        ) : (
          <div className="no-history-box" style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            <p>No recent history available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;