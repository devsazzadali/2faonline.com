import React from 'react';
import './History.css';

const History = ({ historyData }) => {
  return (
    <div className="history-container">
      <div className="history-header-main">
        <span className="history-clock-icon">⏱</span>
        <h3 className="history-title">Recent Keys (Last 7 Days)</h3>
      </div>
      
      <div className="history-grid">
        {historyData.length > 0 ? (
          historyData.map((item, index) => (
            <div key={index} className="history-card">
              <div className="hist-card-top">
                <span className="hist-acc-name">{item.name || 'Account'}</span>
                <span className="hist-time-ago">{item.timeAgo || '25m ago'}</span>
              </div>
              <div className="hist-masked-key">
                {item.maskedKey || 'GFGK****N MN'}
              </div>
              <div className="hist-added-date">
                Added: {item.addedTime || '25m ago'}
              </div>
            </div>
          ))
        ) : (
          <p className="no-history">No recent history available.</p>
        )}
      </div>
    </div>
  );
};

export default History;