/**
 * Generates initials from a name or email.
 * @param name - The full name or email address.
 * @returns The initials (e.g., "JD" for "John Doe" or "j" for "john@example.com").
 */
export const getInitials = (name: string): string => {
  if (!name) return "?";

  // Check if it looks like an email
  if (name.includes("@")) {
    return name[0]?.toUpperCase() ?? "?"; // Use optional chaining
  }

  // Process as a name
  const nameParts = name.trim().split(/\s+/).filter(Boolean); // Filter out empty strings
  if (nameParts.length === 0) return "?"; // Handle case where name is only whitespace

  const firstPart = nameParts[0];
  if (nameParts.length === 1 && firstPart) {
    return firstPart[0]?.toUpperCase() ?? "?"; // First letter of single name
  }

  const lastPart = nameParts[nameParts.length - 1];
  if (nameParts.length > 1 && firstPart && lastPart) {
    const firstInitial = firstPart[0];
    const lastInitial = lastPart[0];
    if (firstInitial && lastInitial) {
      // Ensure initials exist
      return `${firstInitial}${lastInitial}`.toUpperCase(); // First and last initial
    }
  }

  // Fallback if only one part exists or initials couldn't be determined
  if (firstPart) {
    return firstPart[0]?.toUpperCase() ?? "?";
  }

  return "?"; // Final fallback
};
