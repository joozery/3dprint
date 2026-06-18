"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  return (
    <>
      {faqs.map((faq) => (
        <FAQItem key={faq._id} q={faq.question} a={faq.answer} />
      ))}
    </>
  );
}
