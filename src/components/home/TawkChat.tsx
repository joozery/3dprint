"use client";

import Script from "next/script";

export default function TawkChat() {
    return (
        <>
            <Script 
                id="tawk-init" 
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();`
                }}
            />
            <Script
                id="tawk-script"
                src="https://embed.tawk.to/639806c1daff0e1306dc5d54/1gk4tkpg5"
                strategy="afterInteractive"
                crossOrigin="anonymous"
            />
        </>
    );
}
