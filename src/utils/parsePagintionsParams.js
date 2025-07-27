function parseNumber(value, defaultValue) {
    if (typeof value === 'undefined') {
        return defaultValue;
    };

    const parsedValue = parseInt(value);

    if (Number.isNaN(parsedValue) === true) {
        return defaultValue;; 
    }
};

export function parsePagintionsParams(query) {
    const { page, perPage } = query;
    
    const pageNumber = parseNumber(page, 1);
    const perPageNumber = parseNumber(perPage, 10);

    return {
        page: pageNumber,
        perPage: perPageNumber,
    };
};