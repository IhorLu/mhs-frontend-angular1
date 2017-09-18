'use strict';
(function () {
  angular.module('resultSetup')
    .component('resultSetup', {
      templateUrl: 'app/admin/result-setup/result-setup.html',
      css: 'app/admin/result-setup/result-setup.css',
      controller: ResultSetupController
    });

  ResultSetupController.$inject = [
    'resultSetupService',
    '$scope',
    '$routeParams',
    '$location',
    '$window',
    'resultSetupBuilder'
  ];

  function ResultSetupController(resultSetupService, $scope, $routeParams, $location, $window, resultSetupBuilder) {
    let vm = this;

    vm.isManualInput = false;
    vm.selectedQuiz = $routeParams.quizNumber;
    vm.isCaptainsOut = false;
    vm.$onInit = onInit;

    function onInit() {
      vm.answerCount = 0;
      initRound();
      initCurrentRound();
      initCurrentQuiz();
      getTeams()
        .then(() => {
          buildResults();
          assignResults()
            .then(initInputType);
        })

    }

    function initInputType() {
      angular.forEach(vm.results, (result) => {
        if (result.score != 0 && result.score != 1 && result.score != undefined) {
          vm.isManualInput = true;
        }
      })
    }

    function isCaptainsInGame() {
      let isCaptainsInGame = false;
      for (let res of vm.results) {
        if (res.score) {
          isCaptainsInGame = true;
          break;
        }
      }
      return isCaptainsInGame;
    }

    function initRound() {
      resultSetupService.getRound($routeParams.gameId, $routeParams.roundNumber)
        .then((round) => {
          vm.round = round;
        });
    }

    function initCurrentQuiz() {
      resultSetupService.getCurrentQuiz($routeParams.gameId)
        .then((quiz) => {
          vm.currentQuiz = quiz;
        })
    }

    function initCurrentRound() {
      resultSetupService.getCurrentRound($routeParams.gameId)
        .then((round) => {
          vm.currentRound = round;
        })
    }

    function getTeams() {
      return resultSetupService.getGameTeams($routeParams.gameId)
        .then((teams) => {
          vm.teams = teams;
        });
    }

    function buildResults() {
      vm.results = {};
      angular.forEach(vm.teams, function (team) {
        let resultKey = [vm.round.$id, vm.selectedQuiz, team.teamId].join('_');

        let result = resultSetupBuilder
          .addQuiz(vm.selectedQuiz)
          .addRound(vm.round.$id)
          .addTeamId(team.teamId)
          .addScore()
          .getResult();

        vm.results[resultKey] = result;
        vm.results[resultKey].teamName = team.name;

      });
      $scope.$watch(() => {
        return vm.results;
      }, (newValue) => {
        vm.answerCount = 0;
        newValue.forEach((item) => {
          if (item.checked) {
            vm.answerCount++;
          }
        })
      }, true)

    }

    function assignResults() {
      return resultSetupService.getQuizResults(vm.round.$id, vm.selectedQuiz, $routeParams.gameId)
        .then((res) => {
          res.forEach((result, key) => {
            if (result.hasOwnProperty("answer") && result.score === 0) {
              result.score = -1;
            }
            Object.assign(vm.results[key], result)
            setChecked(vm.results[key]);
          });
          vm.results = Object.keys(vm.results).map(it => vm.results[it])
        });
    }

    function setChecked(result) {
      if (result.score === -1 && result.hasOwnProperty("answer") && result.needSave === true) {
        result.checked = 1;
        result.score = 0;
      }
      else if (result.hasOwnProperty("auction")) {
        if (result.auction !== null) {
          result.checked = 1;
        }
        else {
          result.checked = 0;
        }
      }
      else if ((result.score !== 0 && result.score !== undefined)) {
        result.checked = 1;
      }
      else {
        result.checked = 0;
      }
    }

    function convertScoreForHintsRound(result) {
      if (result.score === 0 && result.hasOwnProperty("answer")) {
        result.score = -1;
      }
    }

    vm.saveResult = function (result) {
      result.needSave = true;
      setChecked(result);
      resultSetupService.saveQuizResult(result, $routeParams.gameId)
        .then(() => {
          convertScoreForHintsRound(result);
        });
    };

    vm.setQuiz = function (quizNumber) {
      let ref = `/games/${$routeParams.gameId}/rounds/${$routeParams.roundNumber}/${quizNumber}`;
      $location.path(ref);
    };

    vm.nextQuiz = function () {
      if (!isCaptainsInGame() && vm.round.roundType.type == 'CAPTAIN_ROUND') {
        vm.isCaptainsOut = true;
        return;
      }

            if (vm.selectedQuiz < vm.round.numberOfQuestions) {
                if (vm.currentQuiz == vm.selectedQuiz) {
                    vm.currentQuiz++;
                    resultSetupService.setCurrentQuiz(vm.currentQuiz, $routeParams.gameId);
                }
                vm.setQuiz(+vm.selectedQuiz + 1);
            } else if (vm.selectedQuiz == vm.round.numberOfQuestions) {
              resultSetupService.closeRound(vm.round.$id, $routeParams.gameId)
                .then(() => {
                  $window.location.href = `#!/games/${$routeParams.gameId}/rounds`;
                });
            }
        };

    vm.range = function (n) {
      return new Array(n).fill().map((e, i) => i + 1);
    };
  }
})();
