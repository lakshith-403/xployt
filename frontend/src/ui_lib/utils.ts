export function matchUrl(url: string, pattern: string): boolean {
  const [path, _] = url.split('?')

  const regex = new RegExp('^' + pattern.replace(/{\w+}/g, '([^/]+)') + '$')
  return path.match(regex) !== null
}

export function matchUrlWithBase(url: string, pattern: string): boolean {
  const [path, _] = url.split('?')
  const baseRegex = new RegExp('^' + pattern.replace(/{\w+}/g, '([^/]+)') + '.*$')
  return path.match(baseRegex) !== null
}

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