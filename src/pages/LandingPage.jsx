import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';

export default function LandingPage() {
  return (
    <div id="home" className="flex-grow flex flex-col justify-center">
      <Hero />
      <Features />
    </div>
  );
}
