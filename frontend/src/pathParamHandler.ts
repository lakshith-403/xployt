const paths: { [key: string]: [string, string[] | null] } = {
  home: ['/', null],
  home_ext: ['/(\\w+)', ['ext']],
  user: ['/user/(\\d+)(\\w+)', ['user_id', 'username']],
  post: ['/post/(\\d+)', ["post_id"]],
  category: ['/category/(\\d+)', ["category_id"]],
};
export let pathParams: { [key: string]: string } = {};
export const updatePathParams = (newParams: { [key: string]: string }): void => {
  pathParams = newParams;
};

export function parsePathParams(url: string): { [key: string]: string } {
  const path_params: { [key: string]: string } = {};

  for (const key in paths) {
    const regex = new RegExp(`^${paths[key][0]}$`);
    const match = url.match(regex);
    if (match) {
      const paramKeys = paths[key][1];
      if (paramKeys) {
        for (let i = 0; i < paramKeys.length; i++) {
          path_params[paramKeys[i]] = match[i + 1];
        }
      }
    }
  }

  return path_params;
}
