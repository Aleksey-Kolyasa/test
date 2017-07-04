define([], function () {
    'use strict';
    window.mockPromise = function (data, error) {
        return function () {
            return {
                then: function (callback, err) {
                    return error ? err(data) : callback(data)
                }
            }
        }
    };
});