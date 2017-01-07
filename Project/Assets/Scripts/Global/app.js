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
	// Enabling hashbang mode
$locationProvider.html5Mode(false).hashPrefix('!');

// Routes
$stateProvider
.state('login', {
	url: '/login',
	templateUrl: 'Assets/Html/Pages/login.html',
	controller: 'loginCtrl',
	title: 'Sign in'
})
.state('app', {
	templateUrl: 'Assets/Html/Pages/layout.html',
	controller: 'layoutCtrl',
	breadcrumb: false
})
.state('app.dashboard', {
	url: '/',
	templateUrl: 'Assets/Html/Pages/dashboard.html',
	controller: 'dashboardCtrl',
	title: 'Dashboard',
	breadcrumb: 'Dashboard'
})
.state('app.404', {
	url: '/404',
	templateUrl: 'Assets/Html/Pages/404.html',
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

}])
.run(['$rootScope', function($rootScope) {
	$rootScope.pgTitle = 'SellSei v0.0.3';
	// Notifications array
	$rootScope.notifications = [];
}]);

// Enums
angular.module('app').value('Enums', {
	NotifyType: {
		Alert: 'alert',
		Warn: 'warning',
		Info: 'information',
		Ok: 'success'
	}
});

// Root controller
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

// Login page
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

// Layout controller
// Layout controller
angular.module('global').controller('layoutCtrl', ['$scope', '$rootScope', 'Enums', 'notifyService', function($scope, $rootScope, Enums, notify) {
    // Temp
    notify.add('Happy new year Adrian',Enums.NotifyType.Ok);
    notify.add('Kede meet about Vagrant? :-)',Enums.NotifyType.Alert);
    notify.add('Zrub kave!',Enums.NotifyType.Warn);
    notify.add('Szypcei!!!',Enums.NotifyType.Info);


    // Togglers
    $scope.rightSidebar = (typeof localStorage['rightSidebar'] !== 'undefined' ? (localStorage['rightSidebar'] == 'Show') : false);
    $scope.leftSidebar = (typeof localStorage['leftSidebar'] !== 'undefined' ? (localStorage['leftSidebar'] == 'Show') : false);
    $scope.dismissSidebar = (typeof localStorage['dismissSidebar'] !== 'undefined' ? (localStorage['dismissSidebar'] == 'Show') : false);

    $scope.lockedOut = (typeof localStorage['lockedOut'] !== 'undefined' ? (localStorage['lockedOut'] == 'Locked') : false);
    if ($scope.lockedOut) {
        $rootScope.pageTitle = 'Locked out | ' + $rootScope.pgTitle;
    }

    // Dashboard packery thingy
    var updateDashboardTimer;
    var updateDashboard = function() {
    	clearTimeout(updateDashboardTimer);
		updateDashboardTimer = setTimeout(function() {
			$('#dashboard').packery();
		}, 150);
    };
    updateDashboard();

    // Toggling layout elements states
    $scope.toggleSidebar = function(which) {
        $scope[which+'Sidebar'] = !$scope[which+'Sidebar'];
        localStorage[which+'Sidebar'] = ($scope[which+'Sidebar'] ? 'Show' : 'Hide');

        if (which == 'left' && $('#dashboard').length > 0) {
        	updateDashboard();
        }
    };

    // Toggling information messages & notifies tabs
    $scope.dismissTabs = {
        active: 'info',
        toggle: function(tab) {
            if (tab != this.active) {
                this.active = tab;
            }
            if (!$scope.dismissSidebar) {
                $scope.toggleSidebar('dismiss');
            }
        }
    };

    // Full screen toggle
    var fullscreenState = false;
    $scope.fullscreenToggle = function() {
    	if (!fullscreenState) {
    		var el = document.documentElement;

			if (el.requestFullscreen) {
				el.requestFullscreen();
			}
			else if (el.mozRequestFullScreen) {
				el.mozRequestFullScreen();
			}
			else if (el.webkitRequestFullscreen) {
				el.webkitRequestFullscreen();
			}
			else if (el.msRequestFullscreen) {
				el.msRequestFullscreen();
			}
    	}
    	else {
    		var el = document;

			if (el.exitFullscreen) {
				el.exitFullscreen();
			}
			else if (el.mozCancelFullScreen) {
				el.mozCancelFullScreen();
			}
			else if (el.webkitExitFullscreen) {
				el.webkitExitFullscreen();
			}
    	}

    	fullscreenState = !fullscreenState;
        notify.add('Full screen '+(fullscreenState ? 'enabled' : 'disabled'),Enums.NotifyType.Info);
    };

    // Search
    var searchStatus = false;
    $scope.searchToggle = {
    	toggle: function() {
    		$('#search-window').toggleClass('active');
    		searchStatus = $('#search-window').hasClass('active');
    		if (searchStatus) {
				$('#search-input').focus();
    		}
    		else {
    			$('#search-input').blur().val('');
    		}
    	}
    };
	$(document).keypress(function(e) {
        var context = e.target.nodeName;
        if (context != 'INPUT' && context != 'TEXTAREA' && e.which !== 0 && !e.ctrlKey && !e.metaKey && !e.altKey) {        
	        if (!searchStatus) {
	        	$('#search-window').addClass('active');
				$('#search-input').focus();
				searchStatus = true;
	        }
	    }
    });
	$(document).on('keyup', function(e) {
    	if (e.keyCode == 27 && searchStatus) {
    		$scope.searchToggle.toggle();
        }
	});

    // Lock out
    var titleHolder = null;
    $scope.lockToggle = function() {
        $scope.lockedOut = !$scope.lockedOut;
        localStorage['lockedOut'] = ($scope.lockedOut ? 'Locked' : 'Unlocked');

        if ($scope.lockedOut) {
            titleHolder = angular.copy($rootScope.pageTitle);
            $rootScope.pageTitle = 'Locked out | ' + $rootScope.pgTitle;
        }
        else {
            $rootScope.pageTitle = (titleHolder != null ? titleHolder : $rootScope.pgTitle);
            titleHolder = null;
        }
    };

    // Scroll top button
    $scope.scrollTop = function() {
        $('#view-port').animate({
            scrollTop: 0
        }, 250);
    };

    // Shadow on content scroll
    var scrollShadow = false;
    $('#view-port').scroll(function () {
        var scrollDistance = $('#view-port').scrollTop();

        var shadowOpacity = (scrollDistance / ($('#view-port > div').height() - $('#view-port').height())) * 100;
        $('#scroll-shadow').css('opacity', Math.ceil(shadowOpacity) / 100);

        if (scrollDistance > 150) {
            if (!scrollShadow) {
                $('#scroll-top').addClass('active');
                scrollShadow = true;
            }
        }
        else if (scrollDistance <= 150) {
            if (scrollShadow) {
                $('#scroll-top').removeClass('active');
                scrollShadow = false;
            }
        }
    });

}]);

// Directives
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
angular.module('global.breadcrumbs').directive('breadcrumbs', ['$interpolate', '$state', function($interpolate, $state) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'Breadcrumbs.html',
        link: function(scope) {
            scope.breadcrumbs = [];
            scope.displaynameProperty = 'breadcrumb';
            scope.abstractProxyProperty = 'breadcrumbJump';

            if ($state.$current.name !== '') {
                updateBreadcrumbsArray();
            }
            scope.$on('$stateChangeSuccess', function() {
                updateBreadcrumbsArray();
            });

            function updateBreadcrumbsArray() {
                var workingState,
                    displayName,
                    breadcrumbs = [],
                    currentState = $state.$current;

                while(currentState && currentState.name !== '') {
                    workingState = getWorkingState(currentState);
                    if (workingState) {
                        displayName = getDisplayName(workingState);

                        if (displayName !== false && !stateAlreadyInBreadcrumbs(workingState, breadcrumbs)) {
                            breadcrumbs.push({
                                displayName: displayName,
                                route: workingState.name
                            });
                        }
                    }
                    currentState = currentState.parent;
                }
                breadcrumbs.reverse();
                scope.breadcrumbs = breadcrumbs;
            }

            function getWorkingState(currentState) {
                var proxyStateName,
                    workingState = currentState;
                if (currentState.abstract === true) {
                    if (typeof scope.abstractProxyProperty !== 'undefined') {
                        proxyStateName = getObjectValue(scope.abstractProxyProperty, currentState);
                        if (proxyStateName) {
                            workingState = $state.get(proxyStateName);
                        }
                        else {
                            workingState = false;
                        }
                    }
                    else {
                        workingState = false;
                    }
                }
                return workingState;
            }

            function getDisplayName(currentState) {
                var interpolationContext,
                    propertyReference,
                    displayName;

                if (!scope.displaynameProperty) {
                    // if the displayname-property attribute was not specified, default to the state's name
                    return currentState.name;
                }
                propertyReference = getObjectValue(scope.displaynameProperty, currentState);

                if (propertyReference === false) {
                    return false;
                }
                else if (typeof propertyReference === 'undefined') {
                    return currentState.name;
                }
                else {
                    // use the $interpolate service to handle any bindings in the propertyReference string.
                    interpolationContext =  (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;
                    displayName = $interpolate(propertyReference)(interpolationContext);
                    return displayName;
                }
            }

            function getObjectValue(objectPath, context) {
                var i,
                    propertyArray = objectPath.split('.'),
                    propertyReference = context;

                for (i = 0; i < propertyArray.length; i ++) {
                    if (angular.isDefined(propertyReference[propertyArray[i]])) {
                        propertyReference = propertyReference[propertyArray[i]];
                    }
                    else {
                        // if the specified property was not found, default to the state's name
                        return undefined;
                    }
                }
                return propertyReference;
            }

            function stateAlreadyInBreadcrumbs(state, breadcrumbs) {
                var i,
                    alreadyUsed = false;
                for(i = 0; i < breadcrumbs.length; i++) {
                    if (breadcrumbs[i].route === state.name) {
                        alreadyUsed = true;
                    }
                }
                return alreadyUsed;
            }
        }
    };
}]);

// Dashboard controller
// Dashboard controller
angular.module('pages.dashboard').controller('dashboardCtrl', ['$scope', function($scope) {

	// init
	$('#dashboard').packery({
		itemSelector: '.dash-card'
	});

}]);
