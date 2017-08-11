(function () {
    angular
        .module('openGameService')
        .factory('OpenGameServiceFactory', OpenGameServiceFactory);

    OpenGameServiceFactory.$inject = ['$firebaseArray', '$firebaseObject', 'firebaseDataService'];

    function OpenGameServiceFactory($firebaseArray, $firebaseObject, firebaseDataService) {

        let openGamesRef = firebaseDataService.openGames;

        return {
            getAllOpenGames: getAllOpenGames,
            createNewGame: createNewGame
        };

        function getAllOpenGames() {
            return new $firebaseArray(openGamesRef).$loaded();
        }

        function createNewGame(game) {
            let obj = new $firebaseObject(openGamesRef.push());
            obj.$value = game;
            obj.$save();
            return obj.$loaded();
        }

        // function convertAllForFirebase(game) {
        //     let rounds = {};
        //     for (let i = 0; i < game.rounds.length; i++) {
        //         rounds[game.rounds[i].id] = {
        //             numberOfQuestions: game.rounds[i].numberOfQuestions,
        //             name: game.rounds[i].name
        //         };
        //     }
        //     let teams = {};
        //     for (let i = 0; i < game.teams.length; i++) {
        //         teams[game.teams[i].id] = game.teams[i].name;
        //     }
        //     game.teams = teams;
        //     game.rounds = rounds;
        //     return game;
        // }

        function convertTeamsForFirebase(teams) {
            let team = {};
            for (let i = 0; i < teams.length; i++) {
                teams[teams[i].id] = teams[i].name;
            }
            return team;
        }

        function convertRoundsForFirebase(rounds) {
            let round = {};
            for (let i = 0; i < rounds.length; i++) {
                rounds[rounds[i].id] = {
                    numberOfQuestions: rounds[i].numberOfQuestions,
                    name: rounds[i].name
                };
            }
            return round
        }

        // function saveGame(game, gameId) {
        //     let obj = new $firebaseObject(openGamesRef.child(gameId));
        //     game = convertAllForFirebase(game);
        //     obj.$value = game;
        //     obj.$save();
        //     return obj
        //         .$loaded()
        //         .then((res) => {
        //             return res.$id;
        //         }, (err) => {
        //             console.error(err);
        //             return err;
        //         });
        // }

        function addTeams(gameId, teams) {
            let obj = new $firebaseObject(openGamesRef.child(gameId).child('teams'));
            let team = convertTeamsForFirebase(teams);
            obj.$value = team;
            obj.$save();
            return obj.$loaded();
        }

        function addRequest(gameId, request) {
            let obj = new $firebaseObject(openGamesRef.child(gameId).child('requests').push());
            obj.$value = request;
            obj.$save();
            return obj.$loaded();
        }

        function addRounds(gameId, rounds) {
            let obj = new $firebaseObject(openGamesRef.child(gameId).child('rounds'));
            let round = convertRoundsForFirebase(rounds);
            obj.$value = round;
            obj.$save();
            return obj.$loaded();

        }

    }
})();