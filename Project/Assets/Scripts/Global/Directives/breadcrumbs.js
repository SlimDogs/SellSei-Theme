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