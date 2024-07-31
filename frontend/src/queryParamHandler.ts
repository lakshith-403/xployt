// Global container for query parameters
export let queryParams: Record<string, string> = {};
// Function to update query parameters
export const updateQueryParams = (newParams: Record<string, string>): void => {
    queryParams = newParams;
};

export const checkQueryParamExists = (param: string): boolean => {
    return param in queryParams;
};
export const getQueryParamValue = (param: string): string | false => {
    return queryParams[param] || false;
};

export const parseQueryParams = (queryString: string): Record<string, string> => {
    const urlParams = new URLSearchParams(queryString);
    const params: Record<string, string> = {};
    urlParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
};