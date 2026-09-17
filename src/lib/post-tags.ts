/**
 * The tag list for a blog post.
 *
 * `tags` is the source of truth, but it is absent from any snapshot published
 * before phase 185 added it, and Go's `omitempty` drops it entirely when empty.
 * The legacy single `tag` is kept in sync by the API as tags[0], so falling back
 * to it keeps older content rendering exactly as before.
 */
export function postTags(post: {
  tags?: string[] | null;
  tag?: string | null;
}): string[] {
  const many = (post.tags ?? []).map((t) => t?.trim()).filter((t): t is string => Boolean(t));
  if (many.length > 0) return many;
  const one = post.tag?.trim();
  return one ? [one] : [];
}
