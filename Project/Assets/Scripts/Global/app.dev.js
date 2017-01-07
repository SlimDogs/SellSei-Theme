// Global modules
angular.module('global.notifications', ['ngAnimate']);
angular.module('global.breadcrumbs', []);
angular.module('global.uiElements', []);
angular.module('global', ['global.notifications', 'global.breadcrumbs', 'global.uiElements']);

// Pages collection
angular.module('pages.dashboard', []);
angular.module('pages', ['pages.dashboard']);

angular.module('app', [
		'global',
		'pages',
		'ui.router'
	])
.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {

	// Routing
	@@include('routing.js')

}])
.run(['$rootScope', function($rootScope) {
	$rootScope.pgTitle = 'SellSei v@@version';
	// Notifications array
	$rootScope.notifications = [];
}]);

// Enums
@@include('enums.js')

// Root controller
@@include('Controllers/rootCtrl.js')

// Login page
@@include('../Pages/loginCtrl.js')

// Layout controller
@@include('Controllers/layoutCtrl.js')

// Directives
@@include('Directives/inputBox.js')
@@include('Directives/notifications.js')
@@include('Directives/breadcrumbs.js')

// Dashboard controller
@@include('../Pages/dashboardCtrl.js')
