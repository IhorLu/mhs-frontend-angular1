'use strict';

// Declare app level module which depends on views, and components
angular.module('mhs', [
    'ngRoute',
    'ngMessages',
    'mhs.admin',
    'mhs.player',
    'angularCSS',
    'teamFactory',
    'gameFactory',
    'resultSetup',
    'firebaseDataService',
    'userAuthService',
    'internalisation',
    'openGameService',
    'gameRequestService',
    'teamRequestService',
    'gameTemplateService',
    'gameBuildService',
    'convertService',
    '720kb.socialshare',
    'roundTypeService',
    'seasonService'
])
    .config(['$locationProvider', '$routeProvider', '$animateProvider',
        function ($locationProvider, $routeProvider, $animateProvider) {
            $animateProvider.classNameFilter(/animated/);
            $locationProvider.hashPrefix('!');
            $routeProvider.otherwise({redirectTo: '/games'});
        }]);
console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function () {
};
