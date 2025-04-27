import { CACHE_STORE } from "@data/cache";
import { User } from "@data/user";

/**
 * Maps a project state string to a corresponding CSS class string.
 * @param state - The project state string.
 * @param userType
 * @returns The corresponding CSS class string.
 */
export function mapProjectStateToClass(state: string, userType: string): string {
  switch (state) {
    case 'Pending':
      return `severity ${userType == "Client" ? "INFORMATIONAL" : "CRITICAL"}`;
    case 'Active':
      return 'severity HIGH';
    case 'Unconfigured':
      return `severity ${userType != "Client" ? "INFORMATIONAL" : "CRITICAL"}`;
    case "Configured":
      return `severity ${userType == "Client" ? "INFORMATIONAL" : "CRITICAL"}`;
    case 'Closed':
      return 'severity UNKNOWN';
    case 'Review':
      return 'severity HIGH';
    case 'Rejected':
      return 'severity INFORMATIONAL';
    case 'Completed':
      return 'severity INFORMATIONAL';
    default:
      return '';
  }
}