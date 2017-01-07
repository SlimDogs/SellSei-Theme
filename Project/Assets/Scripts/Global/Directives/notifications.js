angular.module('global.notifications').directive('notifications', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'Notifications.html',
        controller: 'NotificationCtrl'
    }
})
.controller('NotificationCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.funct = {
        close: function (index) {
            $rootScope.notifications.splice(index, 1);
        }
    };
}])
.service('notifyService', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    this.add = function (message, type) {
        if (typeof message !== 'undefined') {
            var notification = {
                type: (typeof type !== 'undefined' ? type.toLowerCase() : 'information'),
                message: message
            };

            $rootScope.notifications.unshift(notification);

            // Launching timing function
            $timeout(function () {
                $rootScope.notifications.splice(($rootScope.notifications.length-1), 1);
            }, 5000);
        }
    };
}]);