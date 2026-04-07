import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    const startTime = Date.now();
    await dbConnect();
    const dbLatency = Date.now() - startTime;

    // Fetch counts for data integrity check
    const [orderCount, userCount, quoteCount] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Quote.countDocuments(),
    ]);

    return NextResponse.json({
      status: "online",
      database: {
        connected: mongoose.connection.readyState === 1,
        latency: `${dbLatency}ms`,
        name: mongoose.connection.name,
      },
      stats: {
        orders: orderCount,
        users: userCount,
        quotes: quoteCount,
      },
      environment: {
        node_version: process.version,
        next_version: "15.0.0", // Hardcoded or extracted from package if possible
        uptime: `${process.uptime().toFixed(0)}s`,
      },
      services: {
        cloudinary: !!process.env.CLOUDINARY_URL || !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        mongodb: !!process.env.MONGODB_URI,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: "degraded", 
        error: error.message,
        timestamp: new Date().toISOString() 
      }, 
      { status: 500 }
    );
  }
}
