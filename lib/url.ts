import queryString from 'query-string';


export interface UrlQueryParams {
    params: string;
    key: string;
    value: string;
}

export interface RemoveUrlQueryParams {
    params: string;
    keystoRemove: string[];
}

// Update the URL with the new search query
export const formUrlQuery = ({params, key, value}: UrlQueryParams) => {
    // get access to the current Url
    const currentUrl = queryString.parse(params);

    currentUrl[key] = value;
    // convert the object to a query string
    return queryString.stringifyUrl({
        url: window.location.pathname,
        query: currentUrl,
    });
}


// Remove the search query from the URL
export const removeKeysFormUrlQuery = ({params, keystoRemove}: RemoveUrlQueryParams) => {
    // get access to the current Url
    const currentQuery = queryString.parse(params);

    keystoRemove.forEach((key) => {
        delete currentQuery[key];
    });
    // convert the object to a query string
    return queryString.stringifyUrl({
        url: window.location.pathname,
        query: currentQuery,
    }, {skipNull: true});
}
