export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w฀-๿-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function generateUniqueSlug(
  name: string,
  UserModel: any,
  excludeId?: string
): Promise<string> {
  const base = toSlug(name) || "user";
  let slug = base;
  let counter = 2;
  while (true) {
    const query: any = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await UserModel.findOne(query).lean();
    if (!existing) return slug;
    slug = `${base}-${counter++}`;
  }
}
