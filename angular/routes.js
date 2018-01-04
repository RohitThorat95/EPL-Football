app.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl : 'views/mainPage.html'
  })
  .when('/allmatch', {
    templateUrl : 'views/allmatch.html',
    controller  : 'allMatchController'
  })
  .when('/matchdetails/:roundname/:match', {
    templateUrl : 'views/matchdetails.html',
    controller  : 'matchDetailsController'
  })
  .when('/stats', {
    templateUrl : 'views/stats.html',
    controller  : 'statsController'
  })
  .otherwise('/errorpage', {
    redirectTo : '/'
  });
}]);
