export const fullEventId = (event: { publicId: string; title: string }) => {
  return `${slugifyEvent(event)}-${event.publicId}`;
};

const slugStringMaxLength = 35;

export const slugifyEvent = (event: { title: string }) => {
  const slug = event.title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-{2,}/g, "-");

  if (slug.length <= slugStringMaxLength) {
    return slug;
  }

  const lastDashWithinLimit = slug
    .substring(0, slugStringMaxLength)
    .lastIndexOf("-");
  if (lastDashWithinLimit > 0) {
    return slug.substring(0, lastDashWithinLimit);
  }

  return slug.substring(0, slugStringMaxLength);
};
