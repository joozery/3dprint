import dbConnect from "@/lib/mongoose";
import Quote from "@/models/Quote";
import ModelsView from "@/components/admin/models/ModelsView";

async function getModelInventory() {
  await dbConnect();
  // We represent "Models" as the distinct project files uploaded in Quotes.
  const models = await Quote.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .lean();

  return JSON.parse(JSON.stringify(models));
}

export default async function AdminModelsPage() {
  const models = await getModelInventory();
  return <ModelsView initialModels={models} />;
}
