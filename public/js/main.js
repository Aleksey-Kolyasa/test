require.config({
	baseUrl : '',
	paths : 
	{
		'app'             : '../js/app/app',
		'services'        : '../js/app/services',
		'angular'         : '../libs/js/angular',
		'angularAnimate'  : '../libs/js/angular-animate.min',
		'angularToastr'	  : '../libs/js/angular-toastr.tpls.min'
		//'bootstrap'       : '../libs/js/bootstrap.min'
	},

	shim : 
	{
		'angular' : {
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

		'services' : {
			deps : ['angularToastr']		
		},

		'app' : {
			deps : ['services']
		}
	},

	deps : ['../js/bootstrap']

});