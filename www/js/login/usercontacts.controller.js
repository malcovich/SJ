angular.module('starter')
  .controller('UserContactsController', ['$cordovaContacts','$scope', '$http',  '$localStorage', 'AuthFactory', 'baseUrl', 'ContactsService', '$ionicPlatform', function($cordovaContacts, $scope, $http, $localStorage, AuthFactory, baseUrl, ContactsService, $ionicPlatform){
    $scope.baseUrl =  baseUrl;
    $ionicPlatform.ready(function() {
      window.plugins.sim.getSimInfo(successCallback, errorCallback);

      function successCallback(result) {
        console.log(result);
        $scope.phoneNumber = result.phoneNumber;
      }

      function errorCallback(error) {
        console.log(error);
      }
      
      $scope.contacts = [];
      $scope.sendedArr = []; 

      $cordovaContacts.find({filter : '', fields:  [ 'displayName']}).then(function(allContacts) { //replace 'Robert' with '' if you want to return all contacts with .find()
        allContacts.forEach(function(contact){
          var userContact = {
            'displayName' : contact.displayName,
            'emails' : contact.emails
          };

          if (contact.phoneNumbers != null) {
            userContact.phones = contact.phoneNumbers.map(function(phone){
              return phone.value;
            });
          }else {
            userContact.phones = null;
          };
                   
          $scope.contacts.push(userContact);
        });

        $http.post(baseUrl + '/api/user/findByContactsList', $scope.contacts).then(function(res){
          $scope.resFriends = res.data;
        });
      });
    })

    AuthFactory.me().then(function(user ){
      $scope.user = user.data.data;  

      $scope.deleteNewRequest = function(id){
        $scope.sendedArr.splice($scope.sendedArr.indexOf(id), 1);

        // $http.post(baseUrl + '/api/user/findByContactsList', $scope.contacts).then(function(res){
        //   $scope.resFriends = res.data;
        //   $scope.sendedArr.push(id);
        // })
      }

      $scope.addNewRequest = function(id){
        var data = {
          useridinvite: $scope.user._id,
          useridaccept: id,
          accepted: false,
          deleted: false
        }
        $http.post(baseUrl + '/api/friend/add', data).then(function(res){
          $scope.sendedArr.push(id);
          console.log($scope.sendedArr,  $scope.resFriends)
        })
      }

      $scope.showDeletedButton = function(id){
        if ($scope.sendedArr.indexOf(id) > -1){
          return true;
        } 
      }
      $scope.showAddButton = function(id){
        if ($scope.sendedArr.indexOf(id) == -1){
          return true;
        } 
      }
    });
}]);