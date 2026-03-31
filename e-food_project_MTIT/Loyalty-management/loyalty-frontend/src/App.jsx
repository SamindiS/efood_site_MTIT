import React from 'react';
import PromoCodeValidator from './components/PromoCodeValidator';
import LoyaltyPointsManager from './components/LoyaltyPointsManager';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-[var(--color-primary)] text-white py-6 shadow-md">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Loyalty & Promotions</h1>
            <p className="text-white/80 text-sm mt-0.5">Manage customer rewards and promo codes seamlessly.</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 mt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <PromoCodeValidator />
          </div>
          <div className="space-y-6">
            <LoyaltyPointsManager />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
