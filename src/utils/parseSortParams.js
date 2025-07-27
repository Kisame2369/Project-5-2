function parseSortBy(value, defaultValue) {
    if (typeof value === "undefined") {
        return defaultValue;
    };

    const keys = ["_id", "name", "phoneNumber", "email"];

    if (keys.includes(value) !== true) {
        return defaultValue;
    };

    return value;
};

function parseSortOrder(value, defaultValue) {
    if (typeof value === "undefined") {
        return defaultValue;
    };

    const secondDefaultValue = "desc";

    if (value !== defaultValue && value !== secondDefaultValue) {
        return defaultValue;
    }

    return value;
}

export function parseSortParams(query) {

    const { sortBy, sortOrder } = query;

    const parsedSortBy = parseSortBy(sortBy, "_id");
    const parsedSortOrder = parseSortOrder(sortOrder, "asc");

    return {
        sortBy: parsedSortBy,
        sortOrder: parsedSortOrder,
    };

};