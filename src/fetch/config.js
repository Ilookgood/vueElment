{

    url: '/user',
        method: 'get', // default
    baseURL: 'https://some-domain.com/api/',
    transformRequest: [function (data) {
    // Do whatever you want to transform the data

    return data;
}],

    // `transformResponse` allows changes to the response data to be made before
    // it is passed to then/catch
    transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
}],

    headers: {'X-Requested-With': 'XMLHttpRequest'},

    params: {
        ID: 12345
    },

    paramsSerializer: function(params) {
        return Qs.stringify(params, {arrayFormat: 'brackets'})
    },

    data: {
        firstName: 'Fred'
    },
    timeout: 1000,

        // `withCredentials` indicates whether or not cross-site Access-Control requests
        // should be made using credentials
        withCredentials: false, // default

    // `adapter` allows custom handling of requests which makes testing easier.
    // Call `resolve` or `reject` and supply a valid response (see [response docs](#response-api)).
    adapter: function (resolve, reject, config) {
    /* ... */
},

    auth: {
        username: 'janedoe',
            password: 's00pers3cret'
    }

    responseType: 'json', // default
        xsrfCookieName: 'XSRF-TOKEN',

    xsrfHeaderName: 'X-XSRF-TOKEN',
    progress: function(progressEvent) {
}
}