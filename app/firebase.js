angular.module('firebaseConnection', [])
    .factory('dbConnection', dbConnection);

function dbConnection(){
    const config = {
        apiKey: "AIzaSyC1Fp_KdosilSSTrWwYQA4Ds_ST1vW9wag",
        authDomain: "fir-test-281a3.firebaseapp.com",
        databaseURL: "https://fir-test-281a3.firebaseio.com",
        projectId: "fir-test-281a3",
        storageBucket: "",
        messagingSenderId: "167618079771"
    };

    if (!firebase.apps.length) {
        return firebase.initializeApp(config).database();
    } else {
        return firebase.database();
    }
}
