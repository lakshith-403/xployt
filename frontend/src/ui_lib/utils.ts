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

/**
 * Extracts path parameters from a URL based on a specified pattern.
 * The pattern can include placeholders in the format {key} which will be matched against the URL.
 * 
 * @param url - The URL from which to extract path parameters.
 * @param pattern - The pattern to match against, containing placeholders for parameters.
 * @returns An object containing key-value pairs of the extracted path parameters.
 */
export function extractPathParams(url: string, pattern: string): Record<string, string> {
  const paramNames = (pattern.match(/{\w+}/g) || []).map(param => param.slice(1, -1))
  const params: Record<string, string> = {}

  const match = url.match(new RegExp('^' + pattern.replace(/{\w+}/g, '([^/]+)') + '$'))

  paramNames.forEach((name, index) => {
      params[name] = match ? match[index + 1] : ''
  })

  return params
}