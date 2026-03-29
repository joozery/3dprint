import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import { notFound } from "next/navigation";
import AdvancedViewer3D from "@/components/quote/AdvancedViewer3D";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "3D Viewer | 3D Print Pro",
};

export default async function ViewerPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await dbConnect();
    const quote = await Quote.findById(params.id);

    if (!quote) {
        notFound();
    }

    if (!quote.fileUrl) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen bg-slate-50">
                <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center max-w-sm">
                    <p className="text-4xl mb-4">⚠️</p>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">3D File Not Uploaded</h2>
                    <p className="text-sm text-slate-500">โมเดลนี้ประเมินราคาสำเร็จแต่ไม่มีไฟล์ 3D ถูกเซฟบนคลาวด์ (อาจโดนตัดออกเพราะไฟล์ใหญ่เกินลิมิตทดสอบ)</p>
                </div>
            </div>
        );
    }

    // Serialize Mongoose doc to object
    const quoteData = {
        _id: quote._id.toString(),
        fileName: quote.fileName,
        originalName: quote.originalName,
        fileUrl: quote.fileUrl,
        volumeCm3: quote.volumeCm3,
        weightGrams: quote.weightGrams,
        dimensions: quote.dimensions ? {
            x: quote.dimensions.x,
            y: quote.dimensions.y,
            z: quote.dimensions.z,
        } : null,
    };

    return (
        <div className="w-full h-screen overflow-hidden bg-slate-200 relative">
            <AdvancedViewer3D quote={quoteData} />
        </div>
    );
}
