angular.module('showResult')
    .component('showResult', {
        templateUrl: 'admin/show-result/show-result.html',
        controller: ['ResultServiceFactory', 'GameServiceFactory', '$routeParams', '$rootScope', '$location', '$window','userAuthService', function (ResultService, GameService, $routeParams, $rootScope, $location, $window,auth) {


            this.getDetails = function (teamResult) {
                $location.path(`/show-team-result/${$routeParams.gameId}/${teamResult.teamId}`);
            };

            ResultService.getParsedResults($routeParams.gameId)
                .then((result) => {
                    this.results = result;
             });

            this.onBack = function () {
                auth.currentUser()
                    .then(()=>{
                    $location.path(`/round-status/${$routeParams.gameId}`);
                })
                .catch (()=>{
                    $location.path(`/game-list`);
                })
                ;
            }
        }]

    });