angular.module('global.uiElements').directive('inputBox', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            uiInput: '='
        },
        templateUrl: 'InputBox.html',
        controller: 'inputBoxCtrl'
    }
})
.controller('inputBoxCtrl', ['$scope', '$element', function ($scope, $element) {
    if (typeof $scope.uiInput.required !== 'undefined') {
        $element.children('input').blur(function() {
            // Required check
            if ($element.children('input').val().length == 0) {
                $scope.errorMessage = 'Required';
            }
            else if (typeof $scope.errorMessage !== 'undefined') {
                delete $scope.errorMessage;
            }
            if (!$scope.$$phase) $scope.$apply();
        });
    };

    $element.click(function() {
        $element.children('input').focus();
    });
}]);