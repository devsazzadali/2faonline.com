import React from 'react';
import './End.css';

const End = () => {
  return (
    <div className="footer-layout">
      {/* How to Use Section */}
      <section className="how-to-use-card">
        <h3>How to Use</h3>
        <ul>
          <li>Enter a name for your account (optional)</li>
          <li>Paste the secret key from your 2FA setup</li>
          <li>Your code will generate automatically every 30 seconds</li>
          <li>Click the code to copy it to your clipboard</li>
          <li>Add multiple accounts as needed</li>
          <li>Your keys are saved locally for 7 days</li>
        </ul>
      </section>

      {/* Account Store One Main Blue Section */}
      <section className="pro-ads-container">
        <div className="pro-ads-header">
          <div className="brand">
            <span className="brand-icon">📱</span> 
            <span className="brand-name">Account Store One</span>
            <span className="premium-tag">Premium Partner</span>
          </div>
          <h4>Professional Facebook Advertising Solutions</h4>
        </div>

        {/* Warning Alert Box */}
        <div className="warning-box">
          <div className="warning-content">
            <span className="warning-icon">⚠️</span>
            <div>
              <strong>Tired of Facebook ad account bans and restrictions?</strong>
              <p>Account Store One provides verified business managers, aged profiles, and high-trust advertising assets that help thousands of marketers scale their campaigns without interruption.</p>
            </div>
          </div>
        </div>

        {/* 3 Grid Boxes */}
        <div className="features-grid">
          <div className="white-card">
            <div className="card-icon blue-bg">🏢</div>
            <h5>Verified Business Managers</h5>
            <p>High-limit BMs ready for immediate use</p>
          </div>
          <div className="white-card">
            <div className="card-icon dark-bg">👤</div>
            <h5>Aged Facebook Profiles</h5>
            <p>Established profiles with proven history</p>
          </div>
          <div className="white-card">
            <div className="card-icon green-bg">✅</div>
            <h5>Blue Tick Pages</h5>
            <p>Verified pages for enhanced credibility</p>
          </div>
        </div>

        {/* Bottom Text and Button */}
        <div className="pro-ads-footer">
          <p>Join over 5,000+ successful marketers who rely on Account Store One for their advertising infrastructure. 24/7 support and competitive pricing included.</p>
          
          <div className="footer-actions">
            <a href="http://accountstoreone.com/" className="visit-btn">account store one →</a>
            <span className="badge-outline blue-text">24/7 Support</span>
            <span className="badge-outline green-text">5,000+ Customers</span>
          </div>
        </div>
      </section>
      
      <div className="copyright-text">© 2025 All Rights Reserved.</div>
    </div>
  );
};

export default End;