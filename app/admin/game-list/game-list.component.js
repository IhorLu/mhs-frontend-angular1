(function () {
    'use strict';
    angular.module('game-list')
        .component('gameList', {
            templateUrl: 'admin/game-list/game-list.html',
            controller: GameList
        });

    GameList.$inject = ['$location', 'userAuthService'];

    function GameList($location, userService) {
        let vm = this;

        vm.auth = false;
        userService.currentUser().then((res) => {
            vm.auth = true;
        }).catch((err) => {
            vm.auth = false;
        });
    }
})();