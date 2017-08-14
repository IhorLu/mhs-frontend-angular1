'use strict';
angular
    .module('mhs.admin', ['ngRoute',
        'firebase',
        'addTeams',
        'gameType',
        'gameResultsPage',
        'roundStatus',
        'teamResults',
        'login',
        'login-panel',
        'game-list',
        'ui.bootstrap'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setup-game-type/:gameId', {
            template: '<game-type></game-type>',
            css: 'admin/game-build/game-type/game-type.css',
            resolve: {
                currentUser: ['userAuthService', function (auth) {
                    return auth.currentUser();
                }]
            }
        });
        $routeProvider.when('/add-teams', {
            template: '<add-teams></add-teams>',
            css: 'admin/add-teams/add-teams.css',
            resolve: {
                currentUser: ['userAuthService', function (auth) {
                    return auth.currentUser();
                }]
            }
        });

        $routeProvider.when('/result-setup/:gameId/:roundNumber/:quizNumber', {
            template: '<result-setup></result-setup>',
            css: 'admin/result-setup/result-setup-page.css',
            resolve: {
                currentUser: ['userAuthService', function (auth) {
                    return auth.currentUser();
                }]
            }
        });
        $routeProvider.when('/edit-result/:gameId', {
            template: '<result-editor></result-editor>',
            css: 'admin/result-editor/result-editor.css',
            resolve: {
                currentUser: ['userAuthService', function (auth) {
                    return auth.currentUser();
                }]
            }
        });
        $routeProvider.when('/round-status/:gameId', {
            template: '<round-status></round-status>',
            resolve: {
                currentUser: ['userAuthService', function (auth) {
                    return auth.currentUser();
                }]
            }
        });
        $routeProvider.when('/login', {
            template: '<login></login>',
            css: 'admin/login/login.css'
        });
        $routeProvider.when('/login-panel', {
            template: '<login-panel></login-panel>'
        });
        $routeProvider.when('/game-list', {
            template: '<game-list></game-list>',
            css:'admin/game-list/game-list.css'
        });
        $routeProvider.when('/games/:gameId/results', {
            template: '<game-results-page></game-results-page>',
            css: 'admin/game-results/game-results-page.css'
        });
        $routeProvider.when('/games/:gameId/results-presentation', {
            template: '<game-results></game-results>',
            css:'admin/game-results/game-results.css',
            controller: 'presentationModeController'

        });
        $routeProvider.when('/games/:gameId/results/:teamId', {
            template: '<team-results></team-results>',
            css: 'admin/team-results/team-results.css'
        });
    }])
    .run(["$rootScope", "$location", 'userAuthService', function ($rootScope, $location, userAuthService) {
        $rootScope.$on("$routeChangeError", function () {
            $location.path("/login");
        });
        userAuthService.currentUser().then((res) => {
            $rootScope.currentUser = res.email;
        })
    }]);
