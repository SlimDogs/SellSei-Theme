// Very root controller
angular.module('global').controller('rootCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

     // Changing title
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (!$rootScope.lockedOut) {
            if (typeof toState.title !== 'undefined') {
    	        $rootScope.pageTitle = toState.title + ' | ' + $rootScope.pgTitle;
    	    }
    	    else {
    	    	$rootScope.pageTitle = $rootScope.pgTitle;
    	    }
        }
    });

}]);