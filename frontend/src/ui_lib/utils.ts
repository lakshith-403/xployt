/**
 * Matches a URL against a specified pattern.
 * @param url - The URL to match.
 * @param pattern - The pattern to match against, with placeholders in the format {key}.
 * @returns True if the URL matches the pattern, false otherwise.
 */
export function matchUrl(url: string, pattern: string): boolean {
  const [path, _] = url.split('?')

  const regex = new RegExp('^' + pattern.replace(/{\w+}/g, '([^/]+)') + '$')
  return path.match(regex) !== null
}

/**
 * Matches a URL against a specified pattern with a base URL.
 * @param url - The URL to match.
 * @param pattern - The pattern to match against.
 * @returns True if the URL matches the pattern with any additional path, false otherwise.
 */
export function matchUrlWithBase(url: string, pattern: string): boolean {
  const [path, _] = url.split('?')
  const baseRegex = new RegExp('^' + pattern.replace(/{\w+}/g, '([^/]+)') + '.*$')
  return path.match(baseRegex) !== null
}

/**
 * Extracts query parameters from a URL.
 * @param url - The URL from which to extract query parameters.
 * @returns An object containing key-value pairs of the query parameters.
 */
export function extractQueryParams(url: string): Record<string, string> {
  const [_, queryString] = url.split('?')

  const queryParams: Record<string, string> = {}
  if (!queryString) {
      return queryParams
  }

  const pairs = queryString.split('&')
  for (const pair of pairs) {
      const [key, value] = pair.split('=')
      queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '')
  }

  return queryParams
}