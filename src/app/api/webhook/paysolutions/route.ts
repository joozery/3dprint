import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const params = new URLSearchParams(bodyText);

        const refno = params.get("refno");      // Order ID
        const status = params.get("status");    // "1" = Success, "0" = Failed
        // Other useful params you might want to log: total, customeremail

        if (!refno) {
            return new NextResponse("Invalid Postback", { status: 400 });
        }

        await dbConnect();

        if (status === "1" || status === "CP") { // Usually 1 or CP means Paid
            await Order.findByIdAndUpdate(refno, {
                paymentStatus: "paid",
                status: "processing", // Move to processing
                // Note: You can add more detailed logs here if needed
            });
            console.log(`Paysolutions Webhook: Order ${refno} paid successfully.`);
        } else {
            console.log(`Paysolutions Webhook: Order ${refno} payment failed or cancelled. Status: ${status}`);
        }

        // Must return 200 OK so Paysolutions knows we received it
        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.error("Paysolutions Webhook Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
