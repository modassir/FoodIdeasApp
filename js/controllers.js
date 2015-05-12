var myAppControllers = angular.module('myAppControllers', []);
 
// Home controller
myAppControllers.controller('HomeCtrl', [
	"$scope", 
	"$firebaseArray",
 	function($scope, $firebaseArray) {
	 	"use strict";
	 	var ref = new Firebase("https://foodideas.firebaseio.com/ideas");
	 	$scope.ideas = $firebaseArray(ref);

    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $scope.dispLogin = "none";
        $scope.dispSignup = "none";
        $scope.dispLogout = "";
        $scope.dispName = "";
        var userInfoRef = new Firebase("https://foodideas.firebaseio.com/users/" + authData.uid);
        var userInfo;
        userInfoRef.on("value", function(data) {
          userInfo = data.val();
          $scope.user_name = userInfo.name;
          console.log(userInfo);
        });
        $scope.addFoodIdea = function() {
          if($scope.foodIdea && $scope.ideaTitle) {
            var newIdeaRef = $scope.ideas.$add({              
              title: $scope.ideaTitle,
              text: $scope.foodIdea,
              timestamp: Firebase.ServerValue.TIMESTAMP,
              upvotes: 0,
              downvotes: 0
            }).then(function(newIdeaRef) {
                var ideaId = newIdeaRef.key();
                console.log(ideaId);
                var ideaIdRef = new Firebase("https://foodideas.firebaseio.com/ideas/" + ideaId);
                ideaIdRef.child('user').set({
                  name: userInfo.name,
                  user_id: authData.uid
                });
                ideaIdRef.child('comments').set({
                  init: true
                });
                var userIdeasRef = new Firebase("https://foodideas.firebaseio.com/users/" + authData.uid + "/ideas");
                userIdeasRef.child(ideaId).set(true);
              });
            $scope.ideaTitle = "";
            $scope.foodIdea = "";
          }
        }
      }
      else {
        console.log("User is logged out");
        $scope.dispLogin = "";
        $scope.dispSignup = "";
        $scope.dispLogout = "none";
        $scope.dispName = "none";

        $scope.addFoodIdea = function() {
          alert("Please login before posting your idea.");
        }
      }
    }
    // Register the callback to be fired every time auth state changes
    var ref = new Firebase("https://foodideas.firebaseio.com");
    ref.onAuth(authDataCallback);

    $scope.logout = function() {
      var ref = new Firebase("https://foodideas.firebaseio.com");
      ref.unauth();
      console.log("Successfully logged out");
    }
	}
]);

myAppControllers.controller('IdeaCtrl', [
  "$scope",
  "$routeParams",
  "$firebaseArray",
  function($scope, $routeParams, $firebaseArray) {
    "use strict";
    $scope.ideaId = $routeParams.ideaId;
    console.log($scope.ideaId);
    var ideaInfoRef = new Firebase("https://foodideas.firebaseio.com/ideas/" + $scope.ideaId);
    var ideaInfo;
    ideaInfoRef.on("value", function(data) {
      ideaInfo = data.val();
    });
    $scope.idea_title = ideaInfo.title;
    $scope.idea_text = ideaInfo.text;
    $scope.idea_user_name = ideaInfo.user.name;
    $scope.idea_timestamp = ideaInfo.timestamp;
    $scope.idea_upvotes = ideaInfo.upvotes;
    $scope.idea_downvotes = ideaInfo.downvotes;

    var commentRef = new Firebase("https://foodideas.firebaseio.com/comments/" + $scope.ideaId);
    $scope.comments = $firebaseArray(commentRef);

    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $scope.dispLogin = "none";
        $scope.dispSignup = "none";
        $scope.dispLogout = "";
        $scope.dispName = "";

        var userCommentRef = new Firebase("https://foodideas.firebaseio.com/users/" + authData.uid);
        var userInfo;
        userCommentRef.on("value", function(data) {
          userInfo = data.val();
          $scope.user_name = userInfo.name;
        });

        $scope.upvote = function() {
          // Increment Upvotes by 1.
          var ideaUpvoteRef = new Firebase("https://foodideas.firebaseio.com/ideas/" + $scope.ideaId + "/upvotes");

          ideaUpvoteRef.transaction(function(currentUpvotes) {
            return currentUpvotes+1;
          });
          $scope.idea_upvotes = ideaInfo.upvotes;
        }

        $scope.downvote = function() {
          // Increment Downvotes by 1.
          var ideaDownvoteRef = new Firebase("https://foodideas.firebaseio.com/ideas/" + $scope.ideaId + "/downvotes");

          ideaDownvoteRef.transaction(function(currentDownvotes) {
            return currentDownvotes+1;
          });
          $scope.idea_downvotes = ideaInfo.downvotes;
        }

        $scope.postComment = function() {
          var newCommentRef = $scope.comments.$add({
            text: $scope.comment,
            timestamp: Firebase.ServerValue.TIMESTAMP,
            useful: 0
          }).then(function(newCommentRef) {
            var commentId = newCommentRef.key();
            var commentIdRef = new Firebase("https://foodideas.firebaseio.com/comments/" + $scope.ideaId + "/" + commentId);
            commentIdRef.child('user').set({
              name: userInfo.name,
              user_id: authData.uid
            });
            var ideaCommentRef = new Firebase("https://foodideas.firebaseio.com/ideas/" + $scope.ideaId + "/comments");
            ideaCommentRef.child(commentId).set(true);
          });
          $scope.comment = "";
        }
      }
      else {
        console.log("User is logged out");
        $scope.dispLogin = "";
        $scope.dispSignup = "";
        $scope.dispLogout = "none";
        $scope.dispName = "none";

        $scope.upvote = function() {
          alert("Please login before voting/downvoting!");
        }
        $scope.downvote = function() {
          alert("Please login before voting/downvoting!");
        }
        $scope.postComment = function() {
          alert("Please login before writing a comment!");
        }
      }
    }
    // Register the callback to be fired every time auth state changes
    var ref = new Firebase("https://foodideas.firebaseio.com");
    ref.onAuth(authDataCallback);

    $scope.logout = function() {
      var ref = new Firebase("https://foodideas.firebaseio.com");
      ref.unauth();
      console.log("Successfully logged out");
    }
  }
]);

myAppControllers.controller('SignUpCtrl', [
  "$scope", 
  "$location",
  "$firebaseArray",
	function($scope, $location, $firebaseArray) {
    'use strict';

    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $location.url("/home");
      } 
      else {
        console.log("User is logged out");
        $scope.addUser = function() {
          var ref = new Firebase("https://foodideas.firebaseio.com");
          ref.createUser({
            email    : $scope.email,
            password : $scope.password
          }, 
          function(error, userData) {
            if (error) {
              console.log("Error creating user:", error);
              alert("Sorry! Error in Creating User! Try after some time!");
            } 
            else {
              console.log("Successfully created user account with uid:", userData.uid);
              var usersRef = new Firebase("https://foodideas.firebaseio.com/users");
              usersRef.child(userData.uid).set({
                name: $scope.name,
                email: $scope.email
              });
              alert("User created Successfully! Now login from the home page!");
            }
          });
        }
      }
    }
    // Register the callback to be fired every time auth state changes
    var ref = new Firebase("https://foodideas.firebaseio.com");
    ref.onAuth(authDataCallback);
  }
]);

myAppControllers.controller('LogInCtrl', [
  "$scope",
  "$location",
  "$firebaseArray",
  function($scope, $location, $firebaseArray) {
    'use strict';

    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        $location.url("/home");
      } 
      else {
        console.log("User is logged out");
        $scope.login = function() {
          var ref = new Firebase("https://foodideas.firebaseio.com");
          ref.authWithPassword({
            email    : $scope.email,
            password : $scope.password
          }, 
          function(error, authData) {
            if (error) {
              console.log("Login Failed!", error);
              alert("Login Failed!");
            } 
            else {
              console.log("Authenticated successfully with payload:", authData);
              $location.url("/home");
              if(!$scope.$$phase) $scope.$apply(); //load ==> use state instead of route
            }
          });
        }
      }
    }
    // Register the callback to be fired every time auth state changes
    var ref = new Firebase("https://foodideas.firebaseio.com");
    ref.onAuth(authDataCallback);
  }
]);
