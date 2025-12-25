import React from "react";
import './Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <h1>2FA  Online – Free Online 2FA Code Generator</h1>
      <p style={{ color: "var(--muted)", marginTop: "6px" }}>
        Generate TOTP codes instantly from your secret keys — secure, fast, works offline in your browser
      </p>
    </section>
  );
};



// Hero.jsx এর ভেতর (উদাহরণ)
const handleSecretChange = (id, newSecret) => {
  // আগের স্টেট আপডেট লজিক...
  
  // যদি সিক্রেট কী ভ্যালিড হয় (যেমন ১০ অক্ষরের বেশি), তবে হিস্ট্রিতে পাঠান
  if (newSecret.trim().length >= 10) {
    onCodeGenerate({
      name: accounts.find(a => a.id === id).name || 'New Account',
      secret: newSecret
    });
  }
};

export default Hero;
