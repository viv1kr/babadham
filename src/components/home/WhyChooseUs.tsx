import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF4EE] text-[#500A18] flex items-center justify-center shrink-0 border border-[#EADBC8]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif-temple font-bold text-sm text-[#380812]">Pan India Delivery</h4>
            <p className="text-xs text-[#735A47] mt-0.5 font-medium">Express air shipping across India</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF4EE] text-[#500A18] flex items-center justify-center shrink-0 border border-[#EADBC8]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif-temple font-bold text-sm text-[#380812]">Secure & Tamper Proof</h4>
            <p className="text-xs text-[#735A47] mt-0.5 font-medium">Air-tight temple seal packaging</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF4EE] text-[#500A18] flex items-center justify-center shrink-0 border border-[#EADBC8]">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif-temple font-bold text-sm text-[#380812]">Easy Returns & Refunds</h4>
            <p className="text-xs text-[#735A47] mt-0.5 font-medium">100% satisfaction guarantee</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EADBC8] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF4EE] text-[#500A18] flex items-center justify-center shrink-0 border border-[#EADBC8]">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif-temple font-bold text-sm text-[#380812]">Dedicated Support</h4>
            <p className="text-xs text-[#735A47] mt-0.5 font-medium">Direct Deoghar Sevak helpline</p>
          </div>
        </div>

      </div>
    </section>
  );
};
