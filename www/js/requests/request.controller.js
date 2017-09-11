angular.module('starter')
  .controller('RequestController', ['$scope', '$log', 'AuthFactory',  '$http', '$stateParams', '$ionicModal', 'baseUrl', function($scope, $log, AuthFactory, $http, $stateParams,$ionicModal, baseUrl){
  	var $ctrl = this;
    $ctrl.requestsList = [];
  	$ctrl.allRequests = [];
    /*id =591c7028ad30f137f06c8559*/
  	AuthFactory.me().then(function(res){
      $ctrl.user = res.data.data;

      $http.post(baseUrl +'/api/requests/item', {'reqId': $stateParams.reqId}).then(function(res){
          $ctrl.request = res.data[0];
          if($ctrl.user._id == $ctrl.request.userId){
            $http.post(baseUrl +'/api/requests/getAllAnswers', {'reqId': $stateParams.reqId}).then(function(res){
                $ctrl.allAnswers = res.data;
            }); 
          }
      });

      $http.post(baseUrl + '/api/contact/all',  {'userId': $ctrl.user._id, 'reqId': $stateParams.reqId}).then(function(res){
            $ctrl.allContatcts = res.data;
       
           $http.post(baseUrl + '/api/requests/getAnswer',  {'userId': $ctrl.user._id, 'reqId': $stateParams.reqId}).then(function(res){
            $ctrl.myAnswer = res.data;

            $ctrl.selectedContacts = res.data[0] ? res.data[0].contacts: [];

            $ctrl.selectedContacts.forEach(function(contact){
              $ctrl.allContatcts.forEach(function(selected){
                if (selected._id == contact._id){
                  selected.selected = true;
                } 
              })
            })
            console.log($ctrl.selectedContacts)
        });
      });
      

    	$ctrl.save = function(){
  /*   		$ctrl.request.userId = '5914c111bef45904e0478f1a';*/
    		$ctrl.request.userId = $ctrl.user._id;
    		$ctrl.request.requestDate = new Date();
    		$http.post(baseUrl + '/api/requests/add', $ctrl.request).then(function(res){
  	      	$ctrl.requestsList.push(res);
  	    });
    	}



    	$ctrl.openModalfromNet = function (size) {
        $ionicModal.fromTemplateUrl('js/requests/selectFromNet.html', {
          scope: $scope
        }).then(function(modal) {
          $ctrl.modal = modal;
          $ctrl.modal.show();
        });

      
       
      };
       $ctrl.saveAnswer = function(){
          $ctrl.selectedContactsId = [];
          $ctrl.selectedContacts = [];
          $ctrl.allContatcts.forEach(function(contact){
            if(contact.selected) {
              $ctrl.selectedContacts.push(contact)
              $ctrl.selectedContactsId.push(contact._id)
            }
          })
          var answer = {
            'requestId': $stateParams.reqId,
            'userId': $ctrl.user._id,
            'contacts' :$ctrl.selectedContacts
          }
           $http.post(baseUrl + '/api/requests/saveAnswer', answer).then(function(res){
            $ctrl.myAnswer =  res.data;
            $ctrl.modal.hide();
          });
        }
    });
	
}]);

