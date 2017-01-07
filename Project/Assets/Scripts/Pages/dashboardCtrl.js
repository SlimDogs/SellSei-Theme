// Dashboard controller
angular.module('pages.dashboard').controller('dashboardCtrl', ['$scope', function($scope) {

	// init
	$('#dashboard').packery({
		itemSelector: '.dash-card'
	});

}]);