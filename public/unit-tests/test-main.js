var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

require.config({
    baseUrl : '/base/js',
    paths :
        {
            'app'             : '../js/app/app',
            'services'        : '../js/app/services',
            'angular'         : '../libs/js/angular',
            'angularMock'     : '../libs/js/angular-mocks',
            'angularAnimate'  : '../libs/js/angular-animate.min',
            'angularToastr'	  : '../libs/js/angular-toastr.tpls.min',
            'spechelper'      : 'unit-tests/spechelper',
            'jQuery'          : '../libs/js/jquery.min'

        },

    shim :
        {
            'jQuery' : {
                exports : 'jQuery'
            },
            'angular' : {
                deps : ['jQuery'],
                exports : 'angular'
            },

            'angularAnimate' : {
                deps : ['angular'],
                exports : 'angularAnimate'
            },

            'angularToastr' : {
                deps : ['angularAnimate'],
                exports : 'angularToastr'
            },

            'angularMock' : {
                deps : ['angular', 'angularAnimate','angularToastr','app','services'],
                exports : 'angularMock'
            },

            'services' : {
                deps : ['angular','angularToastr'],
                exports : 'services'
            },

            'app' : {
                deps : ['angular','services'],
                exports : 'app'
            },

            'spechelper' : {
                exports : 'spechelper'
            }
        },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start

});