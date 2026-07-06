import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import dbConnect from "@/lib/mongoose";
import MaterialPageContent from "@/models/MaterialPageContent";
import MaterialUseCase from "@/models/MaterialUseCase";
import Faq from "@/models/Faq";
import MaterialsPageClient, { FaqItem, MaterialItem, UseCaseItem } from "./MaterialsPageClient";

export const revalidate = 60;

async function getData(): Promise<{ materials: MaterialItem[]; useCases: UseCaseItem[]; faqs: FaqItem[] }> {
    try {
        await dbConnect();
        const [materials, useCases, faqs] = await Promise.all([
            MaterialPageContent.find({ isActive: true }).sort({ order: 1, name: 1 }).lean(),
            MaterialUseCase.find({ isActive: true }).sort({ order: 1, title: 1 }).lean(),
            Faq.find({ isActive: true }).sort({ order: 1 }).limit(5).lean(),
        ]);
        return {
            materials: JSON.parse(JSON.stringify(materials)),
            useCases: JSON.parse(JSON.stringify(useCases)),
            faqs: JSON.parse(JSON.stringify(faqs)),
        };
    } catch {
        return { materials: [], useCases: [], faqs: [] };
    }
}

export default async function MaterialsPage() {
    const { materials, useCases, faqs } = await getData();

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-500/30">
            <Navbar />
            <div className="flex-1">
                <MaterialsPageClient materials={materials} useCases={useCases} faqs={faqs} />
            </div>
            <Footer />
        </div>
    );
}
