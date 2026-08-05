import React from 'react';
import { db } from '../../db/mysqlSim';
import { TempleBorder } from '../ui/TempleBorder';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = db.getReviews();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-[#D98C1F] font-bold">Devotee Experiences</span>
        <h2 className="font-serif-temple text-3xl sm:text-5xl font-extrabold text-[#7A1126] mt-1">
          Words of aastha & Gratitude
        </h2>
        <p className="text-sm text-[#2B1A16]/70 mt-2">
          Read genuine reviews from devotees across India who experienced the purity of Baba Baidyanath Prasad.
        </p>
        <TempleBorder />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev: any) => (
          <div
            key={rev.id}
            className="rounded-3xl glass-card p-8 border border-[#F4A62A]/30 flex flex-col justify-between relative shadow-lg hover:shadow-2xl transition-all group"
          >
            <Quote className="absolute top-6 right-6 w-10 h-10 text-[#7A1126]/10 group-hover:text-[#7A1126]/20 transition-colors" />

            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#F4A62A]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <h4 className="font-serif-temple font-bold text-lg text-[#7A1126] leading-snug">
                "{rev.title}"
              </h4>

              <p className="text-xs text-[#2B1A16]/80 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#7A1126]/10 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-[#2B1A16]">{rev.devoteeName}</div>
                <div className="text-[11px] text-[#2B1A16]/60">{rev.location} • {rev.date}</div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#7A1126] bg-[#7A1126]/10 px-2.5 py-1 rounded-full border border-[#7A1126]/20">
                <ShieldCheck className="w-3 h-3 text-[#F4A62A]" />
                <span>{rev.blessingTag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
