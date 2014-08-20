angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('DoggyListCtrl', function($scope) {
  $scope.doggyList = [
    { url: 'http://th07.deviantart.net/fs71/200H/i/2012/322/a/3/obvious_doggystyle_joke_by_mkbuster-d5lektv.png', id: 1 },
    { url: 'http://s3.amazonaws.com/rapgenius/stick-figure-sex-doggystyle.jpg', id: 2 },
    { url: 'http://www.meemes.com/sites/default/files/styles/galleria_zoom-copy/public/doggy-style-hyena-mating.jpg?itok=-3KU-sKb', id: 3 },
    { url: 'http://i1.trekearth.com/photos/96740/amores_perros.jpg', id: 4 },
    { url: 'http://www.meemes.com/sites/default/files/styles/galleria_zoom-copy/public/doggy-style-panda-mating.jpg?itok=8YWjyUoc', id: 5 },
    { url: 'http://i46.tinypic.com/34rzmue.jpg', id: 6 }
  ];
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
