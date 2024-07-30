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