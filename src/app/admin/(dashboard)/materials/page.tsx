import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import MaterialConfig from "@/models/MaterialConfig";
import MaterialManager from "@/components/admin/materials/MaterialManager";

export const dynamic = "force-dynamic";

export default async function AdminMaterialsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    redirect("/admin/login");
  }

  await dbConnect();
  const rawMaterials = await MaterialConfig.find().sort({ technology: 1, name: 1 }).lean();
  const materials = JSON.parse(JSON.stringify(rawMaterials));

  return <MaterialManager initialMaterials={materials} />;
}
