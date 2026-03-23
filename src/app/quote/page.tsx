"use client";

import Navbar from "@/components/layout/Navbar";
import { ProductSelector } from "@/components/quote/ProductSelector";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { SidebarSummary } from "@/components/quote/SidebarSummary";
import { Footer } from "@/components/home/HomeSections";

import { useState, useEffect } from "react";

export default function QuotePage() {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await fetch("/api/checkout");
                const data = await res.json();
                if (data.success) {
                    setQuotes(data.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch quotes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    const addQuote = (newQuote: any) => {
        setQuotes(prev => [...prev, newQuote]);
    };

    const updateQuote = (updatedQuote: any) => {
        setQuotes(prev => prev.map(q => q._id === updatedQuote._id ? updatedQuote : q));
    };

    const removeQuote = (id: string) => {
        setQuotes(prev => prev.filter(q => q._id !== id));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mx-auto mb-4"></div>
                    <p className="text-sm text-slate-500 font-bold">กำลังเชื่อมต่อข้อมูลตะกร้าของคุณ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            {/* Scrollable Product Header */}
            <ProductSelector />

            <main className="flex-grow">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Main Content Area */}
                        <div className="col-span-12 lg:col-span-9">
                            <QuoteForm
                                quotes={quotes}
                                onAdd={addQuote}
                                onUpdate={updateQuote}
                                onRemove={removeQuote}
                            />
                        </div>

                        {/* Price Sidebar */}
                        <div className="col-span-12 lg:col-span-3">
                            <SidebarSummary quotes={quotes} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
