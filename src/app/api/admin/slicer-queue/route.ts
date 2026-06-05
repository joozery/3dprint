import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getJobs } from "@/lib/slicerQueue";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = getJobs();
  const active    = jobs.filter(j => j.status === "pending" || j.status === "processing").length;
  const done      = jobs.filter(j => j.status === "done").length;
  const failed    = jobs.filter(j => j.status === "failed").length;
  const stuckMs   = 5 * 60 * 1000; // 5 minutes
  const stuck     = jobs.filter(j =>
    (j.status === "pending" || j.status === "processing") &&
    Date.now() - j.startedAt > stuckMs
  ).length;

  return NextResponse.json({ jobs, summary: { active, done, failed, stuck, total: jobs.length } });
}
