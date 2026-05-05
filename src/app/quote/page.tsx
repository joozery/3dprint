"use client";

import { useState, useEffect } from "react";
import { QuoteApp } from "@/components/quote/QuoteApp";
import Navbar from "@/components/layout/Navbar";

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

    if (!isLoaded) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-mono text-sm">Loading Quote Service...</div>;
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-hidden">
                <QuoteApp
                    quotes={quotes}
                    onAdd={addQuote}
                    onUpdate={updateQuote}
                    onRemove={removeQuote}
                />
            </div>
        </div>
    );
}
