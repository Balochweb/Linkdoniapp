/**
 * Formats a number string to display with K for thousands
 * @param membersStr The members count as a string
 * @returns Formatted string (e.g. "100K", "1.5K", "410K")
 */
export const formatMembersCount = (membersStr: string): string => {
  const members = parseInt(membersStr, 10);
  
  if (isNaN(members)) {
    return membersStr;
  }
  
  if (members >= 1000) {
    return `${(members / 1000).toFixed(members % 1000 === 0 ? 0 : 1)}K`;
  }
  
  return members.toString();
};

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
