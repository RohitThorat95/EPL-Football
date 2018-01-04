var app = angular.module('myApp',['ngRoute']);

// All Match Controller
app.controller('allMatchController',['$http','$scope', function($http,$scope){
  $scope.year = "2015";

  $scope.getAllMatch = function() {
    var URL;

// Sort By Year
    if($scope.year == "2015") {
      URL = 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json';
    }
    else {
      URL = 'https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json';
    }

    $scope.allMatch = {};

    $http({method : 'GET',url : URL})
    .then(function successCallback(response){
      // console.log(response);
      $scope.allMatch = response.data;
      // console.log($scope.allMatch);
    },function errorCallback(response){
      alert("Some Error Occured , Press ctrl+shift+j");
      console.log(response);
    });
  }

  $scope.getAllMatch();

}]);
// All Match Controller Ends


// Filter Starts
// Filter for Team
app.filter('teamFilter', function(){
  return function(items, searchName){
    if(angular.isDefined(searchName)){
      var filteredTeam = [];
      var searchedValue = searchName.toLowerCase();

      for(var i=0;i<items.length;i++){
        var name1 = items[i].team1.name.toLowerCase();
        var name2 = items[i].team2.name.toLowerCase();
        if(name1.indexOf(searchedValue) >= 0 || name2.indexOf(searchedValue) >= 0){
          filteredTeam.push(items[i]);
        }
      }
      return filteredTeam;
    }
    else{
      return items;
    }
  };
});

//Filter for score
app.filter('scoreFilter', function(){
   return function(items, searchScore){
     if(!searchScore){
       return items;
     }
     else{
       var filteredScore = [];
       var searhedValue = searchScore;

       for(var i=0;i<items.length; i++){
         var score1 = items[i].score1;
         var score2 = items[i].score2;
         if(score1 == searchScore || score2 == searchScore){
           filteredScore.push(items[i]);
         }
       }
       return filteredScore;
     }
   };
});
// Filter Ends



// Match Details Controller
// routeParams is used for accessing a particular url param
app.controller('matchDetailsController', ['$http','$scope','$routeParams', function($http,$scope,$routeParams){

     $scope.match = JSON.parse($routeParams.match);
     $scope.roundname = $routeParams.roundname;
      // console.log($scope.roundname);
     var score1 = $scope.match.score1;
     var score2 = $scope.match.score2;

     if( score1 > score2){
       $scope.winner = $scope.match.team1.name;
     }
     else if(score2 > score1){
       $scope.winner = $scope.match.team2.name;
     }
     else{
       return $scope.winner = "Draw";
     }
}]);
// Match Details Controller Ends


// StatsController Starts
app.controller('statsController',['$http', '$scope', function($http, $scope){

  $scope.getStats = function(){

    var URL;

    if($scope.year == "2015") {
      URL = 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json';
    }
    else {
      URL = 'https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json';
    }

    $scope.stats = {};

    $http({method : 'GET', url : URL})
    .then(function successCallback(response){
      $scope.stats = response.data;

      $scope.dupTeamNames = [];
      $scope.teamNames = [];

      for(var i = 0 ; i < $scope.stats.rounds.length; i++){
        for(var j = 0 ; j < $scope.stats.rounds[i].matches.length ; j++){
          // pushing into teamName after applying filter.
          $scope.dupTeamNames.push($scope.stats.rounds[i].matches[j].team1.name, $scope.stats.rounds[i].matches[j].team2.name);
        }
      }

         $scope.teamNames = $scope.dupTeamNames.filter(function(val,index,self){
           return (self.indexOf(val) == index);
         });

         $scope.teamStats = [];
         for(var i = 0 ; i < $scope.teamNames.length ; i++){
           $scope.teamStats.push({
             name   : $scope.teamNames[i],
             played : 0,
             goals  : 0,
             won    : 0,
             lost   : 0,
           });
         }

         for(var i=0;i<$scope.stats.rounds.length;i++){
           for(var j=0;j<$scope.stats.rounds[i].matches.length;j++){

             if(!$scope.stats.rounds[i].matches[j].team1.score1 && !$scope.stats.rounds[i].matches[j].team2.score2){

               for(k=0;k<$scope.teamStats.length;k++){

                 if($scope.stats.rounds[i].matches[j].team1.name == $scope.teamStats[k].name && $scope.stats.rounds[i].matches[j].score1 !== null){
                   $scope.teamStats[k].played++;
                   $scope.teamStats[k].goals = $scope.teamStats[k].goals + $scope.stats.rounds[i].matches[j].score1;
                   if ($scope.stats.rounds[i].matches[j].score1 > $scope.stats.rounds[i].matches[j].score2){
                          $scope.teamStats[k].won++;
                      }
                   else if($scope.stats.rounds[i].matches[j].score1 < $scope.stats.rounds[i].matches[j].score2){
                          $scope.teamStats[k].lost++;
                      }

                    else if($scope.stats.rounds[i].matches[j].team2.name == $scope.teamStats[k].name && $scope.stats.rounds[i].matches[j].score2 !== null){
                        $scope.teamStats[k].played++;
                        $scope.teamStats[k].goals = $scope.teamStatsk[k].goals + $scope.stats.round[i].matches[j].score2;
                        if ($scope.stats.rounds[i].matches[j].score2 > $scope.stats.rounds[i].matches[j].score1){
                               $scope.teamStats[k].won++;
                           }
                        else if($scope.stats.rounds[i].matches[j].score1 < $scope.stats.rounds[i].matches[j].score2){
                               $scope.teamStats[k].lost++;
                           }
                 }
               }
             }
           }
         }
       }
       console.log($scope.teamStats);
     },function errorCallback(response){
        alert("Some error occurred. Check the console.");
    });
  }

  $scope.getStats();

}]);
