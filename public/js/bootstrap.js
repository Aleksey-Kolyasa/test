define([
    'require',
    'app'
], function () {
    'use strict';

    /**
     * Bootstrap app once document is ready
     */
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['chatApp']);
    });
});