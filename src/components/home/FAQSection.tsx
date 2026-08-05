import React, { useState } from 'react';
import { TempleBorder } from '../ui/TempleBorder';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: 'How is the Prasad offered at Baba Baidyanath Temple?',
    answer: 'Our dedicated temple sevaks take fresh prasad boxes into the main Garbhagriha during the daily Shinghasan Puja & Sandhya Aarti. The head pujari chants sacred mantras over the offerings before sealing them in clean food-grade boxes.'
  },
  {
    question: 'What is the shelf life of Deoghar Pure Ghee Peda?',
    answer: 'Because our peda is slow-cooked in pure milk khoya and A2 desi cow ghee without added chemical preservatives, it stays fresh and delicious for 20 to 25 days at room temperature.'
  },
  {
    question: 'Are the Rudraksh beads natural and certified?',
    answer: 'Yes, 100%. Every Rudraksh bead is sourced directly from natural Himalayan trees in Nepal. Each mala and bracelet comes with an official authenticity card and X-ray test certificate verifying the internal mukhi chambers.'
  },
  {
    question: 'How long does delivery take across India?',
    answer: 'We dispatch via Express Air Cargo courier partners (Bluedart / DTDC Air). Deliveries to metro cities (Delhi, Mumbai, Bangalore, Kolkata) take 24 to 36 hours. All other locations take 48 hours.'
  },
  {
    question: 'What payment options are available?',
    answer: 'We support instant UPI (Google Pay, PhonePe, Paytm, BHIM), all major Debit/Credit cards, Razorpay Netbanking, and Cash on Delivery (COD).'
  }
];

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-[#D98C1F] font-bold flex items-center justify-center gap-1">
          <HelpCircle className="w-4 h-4" /> Devotee Information
        </span>
        <h2 className="font-serif-temple text-3xl sm:text-5xl font-extrabold text-[#7A1126] mt-1">
          Frequently Asked Questions
        </h2>
        <TempleBorder />
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#FFF8F0] border border-[#F4A62A]/30 overflow-hidden shadow-sm transition-all"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between font-serif-temple font-bold text-lg text-[#7A1126] hover:text-[#D98C1F] transition-colors"
            >
              <span>{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-[#F4A62A] transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {openIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-5 text-xs text-[#2B1A16]/80 leading-relaxed border-t border-[#7A1126]/10 pt-3"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};
