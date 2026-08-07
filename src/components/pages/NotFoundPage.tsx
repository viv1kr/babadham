import React from 'react';
import { Home } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NotFoundPage: React.FC = () => {
  const { setActivePage } = useStore() as any;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] px-4 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-[#2B1A16] font-poppins text-left md:text-center w-full max-w-md">
        You are on the wrong path.
      </h1>
      <div className="w-full max-w-md flex justify-start md:justify-center">
        <button
          onClick={() => setActivePage('home')}
          className="inline-flex items-center gap-2 bg-[#7A1126] text-white px-5 py-2.5 text-sm rounded-full font-semibold hover:bg-[#500A18] transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <Home className="w-4 h-4" />
          Return to Home
        </button>
      </div>
    </main>
  );
};
