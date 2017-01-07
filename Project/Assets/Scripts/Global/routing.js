// Enabling hashbang mode
$locationProvider.html5Mode(false).hashPrefix('!');

// Routes
$stateProvider
.state('login', {
	url: '/login',
	templateUrl: '@@htmlDir/Pages/login.html',
	controller: 'loginCtrl',
	title: 'Sign in'
})
.state('app', {
	templateUrl: '@@htmlDir/Pages/layout.html',
	controller: 'layoutCtrl',
	breadcrumb: false
})
.state('app.dashboard', {
	url: '/',
	templateUrl: '@@htmlDir/Pages/dashboard.html',
	controller: 'dashboardCtrl',
	title: 'Dashboard',
	breadcrumb: 'Dashboard'
})
.state('app.404', {
	url: '/404',
	templateUrl: '@@htmlDir/Pages/404.html',
	title: 'Page not found',
	breadcrumb: 'Page does not exist'
});

// When no route go to dashboard
$urlRouterProvider.when('','/login');

// Enabling 404
$urlRouterProvider.otherwise('/404');

// Enabling case insensitive urls
$urlRouterProvider.rule(function($injector, $location) {
	var path = $location.path(),
		normalized = path.toLowerCase();

	if (path != normalized) {
		return normalized;
	}
});