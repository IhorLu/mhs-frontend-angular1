angular
    .module('seasons')
    .component('seasons',
        {
            templateUrl: 'admin/seasons/seasons.html',
            css: 'admin/seasons/seasons.css',
            controller: seasonsController
        });
seasonsController.$inject = ['GameServiceFactory', '$location', 'seasonService', '$routeParams', '$window'];

function seasonsController(gameFactory, $location, seasonService, $routeParams, $window) {
    let vm = this;

    let seasonId = $routeParams.seasonId;


    seasonService.getSeasonsNames().then((res) => {
        vm.seasons = res;
        setSelectedSeason();
    });

    seasonService.getParsedSeasonResults(seasonId).then((res) => {
        vm.seasonTeams = res;
    });

    vm.closeCurrentSeason = function () {

    };

    let currentTeamPosition;
    vm.getTeamPosition = function (teamId, index, total) {
        let position;

        if (index === 0) {
            position = 1;
            currentTeamPosition = position

        } else if (index >= 1 && total === vm.seasonTeams[index - 1].total) {
            position = currentTeamPosition

        } else {
            position = ++currentTeamPosition;
        }

        return position
    };

    vm.setSeasonUrl = function () {
        if (vm.selectedSeason !== undefined)
            if (seasonId !== vm.selectedSeason.id) {
                seasonId = vm.selectedSeason.id;
                $location.path("seasons/" + seasonId)
            }
    };

    vm.showGame = function (gameId) {
        $location.path("/games/" + gameId + "/results");
    };

    function setSelectedSeason() {
        for (let season  in vm.seasons) {
            if (vm.seasons[season].id === seasonId)
                vm.selectedSeason = vm.seasons[season];
        }
    }
}