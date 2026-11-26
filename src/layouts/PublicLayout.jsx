import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#07181E] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-[#4DE2BD] selection:text-[#07181E]">
      <div className="absolute top-0 right-0 w-[700px] h-[600px] bg-[#143e39]/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[450px] bg-[#0e2c2b]/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <Navbar />

        <main className="flex-grow flex flex-col">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
