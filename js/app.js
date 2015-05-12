var myApp =  angular.module('myApp', [
    'ngRoute',
    'firebase',
    'myAppControllers'    
]);

myApp.config(['$routeProvider', function($routeProvider) {
  "use strict";  

  $routeProvider
    .when('/home', {
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
    })
    .when('/signup', {
      templateUrl: 'partials/signup.html',
      controller: 'SignUpCtrl'
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LogInCtrl'
    })
    .when('/idea/:ideaId', {
      templateUrl: 'partials/idea.html',
      controller: 'IdeaCtrl'
    })
    // Set defualt view of our app to home  
    .otherwise({
      redirectTo: '/home'
    });
  }
]);