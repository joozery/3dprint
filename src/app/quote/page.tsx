"use client";

import Navbar from "@/components/layout/Navbar";
import { ProductSelector } from "@/components/quote/ProductSelector";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { SidebarSummary } from "@/components/quote/SidebarSummary";
import { Footer } from "@/components/home/HomeSections";

import { useState, useEffect } from "react";

export default function QuotePage() {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch pending quotes on initial load
    useEffect(() => {
        const fetchPendingQuotes = async () => {
            try {
                const localIds = JSON.parse(localStorage.getItem("guest_quote_ids") || "[]");
                const res = await fetch(`/api/quote/pending?ids=${localIds.join(",")}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.quotes.length > 0) {
                        setQuotes(data.quotes);
                    }
                }
            } catch (err) {
                console.error("Failed to load pending quotes", err);
            } finally {
                setIsLoaded(true);
            }
        };
        fetchPendingQuotes();
    }, []);

    const addQuote = (newQuote: any) => {
        setQuotes(prev => {
            const updated = [...prev, newQuote];
            const ids = updated.map(q => q._id);
            localStorage.setItem("guest_quote_ids", JSON.stringify(ids));
            window.dispatchEvent(new Event("cart_updated"));
            return updated;
        });
    };

    const updateQuote = (updatedQuote: any) => {
        setQuotes(prev => prev.map(q => q._id === updatedQuote._id ? updatedQuote : q));
    };

    const removeQuote = (id: string) => {
        setQuotes(prev => {
            const updated = prev.filter(q => q._id !== id);
            const ids = updated.map(q => q._id);
            localStorage.setItem("guest_quote_ids", JSON.stringify(ids));
            window.dispatchEvent(new Event("cart_updated"));
            return updated;
        });
    };

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
