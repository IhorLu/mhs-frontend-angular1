angular.module('teamResults')
  .component('defaultResult', {
    templateUrl: 'app/admin/team-result-types/default-result/default-result.html',
    css: 'app/admin/team-result-types/default-result/default-result.css',
    bindings: {
      round: '=',
      resultDisabled: '<',
      auth: '<',
      saveResult: '&'
    },
    controller: defaultResultController
  });

defaultResultController.$inject = [];

function defaultResultController() {
  let vm = this;

  vm.$onInit = onInit;

  function onInit() {
    for (let quiz of vm.round.quizzes) {
      quiz.editMode = false;
      if (quiz.hasOwnProperty("weightOfResponse")) {
        quiz.countAnswer = +((quiz.score / quiz.weightOfResponse).toFixed(1));
      }
    }
  }

  vm.setScore = function (roundNum, quiz) {
    if (quiz.hasOwnProperty("weightOfResponse"))
    quiz.score = +((quiz.weightOfResponse * quiz.countAnswer).toFixed(1));
    if (quiz.score !== 0)
      quiz.real = true;
    quiz.edited = true;
    vm.saveResult({roundNum: roundNum, quiz: quiz})
  };

  vm.editMode = false;
  vm.showEditMode = function (quiz) {
    if (!vm.resultDisabled) {
      quiz.editMode = true;
      vm.editMode = true
    }
  };

  vm.hideEditMode = function (quiz) {
    quiz.editMode = false;
    vm.editMode = false
  };
}
