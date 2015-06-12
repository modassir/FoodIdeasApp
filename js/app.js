var myApp =  angular.module('myApp', [
    'ngRoute',
    'firebase',
    'myAppControllers'
]);

myApp.config(['$routeProvider', '$locationProvider',  function($routeProvider, $locationProvider) {
  "use strict";  

  $routeProvider
    .when('/FoodIdeasApp/home', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
    })
    .when('/FoodIdeasApp/signup', {
      templateUrl: 'partials/signup.html',
      controller: 'SignUpCtrl'
    })
    .when('/FoodIdeasApp/login', {
      templateUrl: 'partials/login.html',
      controller: 'LogInCtrl'
    })
    .when('/FoodIdeasApp/idea/:ideaId', {
      templateUrl: 'partials/idea.html',
      controller: 'IdeaCtrl'
    })
    // Set defualt view of our app to home  
    .otherwise({
      redirectTo: '/FoodIdeasApp/home'
    });

    $locationProvider.html5Mode(true);
  }
]);