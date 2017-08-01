'use strict';
angular.module('resultSetup')
    .component('resultSetup', {
        templateUrl: 'admin/result-setup/result-setup-page.html',
        controller: function ResultSetupController(resultSetupService,$routeParams,$location,$scope) {
            let vm = this;
            vm.mod = $routeParams.mod;
            if(vm.mod == 'edit'){
                vm.buttonType = 'Upgrade';
            }else if(vm.mod == 'play'){
                vm.buttonType = 'Next';
            }
            let gameId = $routeParams.gameId;
            vm.quizNumber = $routeParams.quizNumber;
            vm.currentRound = $routeParams.roundNumber;
            resultSetupService.getData(gameId)
                .then((game) => {
                    vm.quizzes = [];
                    vm.teams = game.teams;
                    let quizCount = game.rounds[$routeParams.roundNumber];
                    console.log(quizCount);
                    for (let i = 1; i <= quizCount; i++) {
                        vm.quizzes.push({number: i, answered: false});
                    }
                    if ($routeParams.quizNumber > parseInt(quizCount)){
                        vm.setQuiz(1);
                    }else{
                        vm.setQuiz($routeParams.quizNumber);
                    }
                    vm.teamsScore = [];
                });

            vm.setQuiz = function (quizNumber) {
                vm.quizNumber = quizNumber;
                vm.teamsScore = [];
                resultSetupService.getQuizResult(gameId, vm.currentRound, vm.quizNumber)
                    .then((results) => {
                        angular.forEach(results, function (result) {
                            vm.teamsScore.push(result.score);
                        })
                    })
            };
            vm.setResult = function () {
                let results = [];
                let promices = [];
                angular.forEach(vm.teams, function (team, key) {
                    results.push(new Result(vm.currentRound, vm.quizNumber, key));
                });
                vm.quizzes[vm.quizNumber - 1].answered = true;
                angular.forEach(results, function (result,key) {
                    promices.push(resultSetupService.setQuizResult(result,vm.teamsScore[key]));
                });
                Promise.all(promices)
                    .then(()=>{
                        if (vm.quizNumber  < vm.quizzes.length) {
                            if(vm.mod.isEqual('play')) {
                                vm.quizNumber++;
                                vm.setQuiz(vm.quizNumber);
                            }
                        }else {
                            if(vm.mod.isEqual('play')) {
                                resultSetupService.roundIncrement(vm.currentRound, gameId);
                                $location.path('/round-status/' + gameId);
                            }
                        }
                    }).then($scope.$apply);
            };
            vm.back = function () {
                $location.history.back();
            }
        }
    });