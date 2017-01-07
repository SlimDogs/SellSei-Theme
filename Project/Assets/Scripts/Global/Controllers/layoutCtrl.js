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