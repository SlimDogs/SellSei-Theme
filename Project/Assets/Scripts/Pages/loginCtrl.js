// Login page controller
angular.module('global').controller('loginCtrl', ['$scope', '$state', function($scope, $state) {

	$scope.uiInputs = {
		username: {
			type: 'text',
			label: 'Login',
			value: '',
			placeholder: 'Username',
			required: true
		},
		password: {
			type: 'password',
			label: 'Password',
			value: '',
			placeholder: 'Credentials',
			required: true
		}
	};

	$scope.remember = {
		state: false,
		toggle: function() {
			this.state = !this.state;
		}
	};

	$scope.login = function() {
		$state.go('app.dashboard');
	};

}]);