export type JobStatus = "pending" | "processing" | "done" | "failed";

export interface SlicerJob {
  id: string;
  fileName: string;
  originalName: string;
  userId: string;
  status: JobStatus;
  step: string;
  startedAt: number;
  finishedAt?: number;
  durationMs?: number;
  error?: string;
}

// In-memory store — resets on server restart, keeps last 200 jobs
const jobs = new Map<string, SlicerJob>();
const MAX_JOBS = 200;

export function createJob(
  id: string,
  fileName: string,
  originalName: string,
  userId: string
): SlicerJob {
  if (jobs.size >= MAX_JOBS) {
    const oldestKey = jobs.keys().next().value;
    if (oldestKey) jobs.delete(oldestKey);
  }
  const job: SlicerJob = {
    id,
    fileName,
    originalName,
    userId,
    status: "pending",
    step: "รอคิว",
    startedAt: Date.now(),
  };
  jobs.set(id, job);
  return job;
}

export function updateJob(id: string, updates: Partial<SlicerJob>) {
  const job = jobs.get(id);
  if (job) jobs.set(id, { ...job, ...updates });
}

export function finishJob(id: string, success: boolean, error?: string) {
  const job = jobs.get(id);
  if (!job) return;
  const finishedAt = Date.now();
  jobs.set(id, {
    ...job,
    status: success ? "done" : "failed",
    step: success ? "เสร็จสิ้น" : "ล้มเหลว",
    finishedAt,
    durationMs: finishedAt - job.startedAt,
    ...(error && { error }),
  });
}

export function getJobs(): SlicerJob[] {
  return Array.from(jobs.values()).reverse();
}
