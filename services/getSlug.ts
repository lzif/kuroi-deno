export function getRealSlug(slug: string): string {
  const b = slug.split("/");
  const c = b.slice(-2);
  const result = c[0].slice(8);
  return result;
}
