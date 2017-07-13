angular.module('starter')
  .controller('CategoryController', ['$scope', '$log', 'AuthFactory', '$http','$state','$stateParams','baseUrl', '$ionicModal', 'ContactsService', '$ionicPlatform','$cordovaContacts', function($scope, $log, AuthFactory, $http, $state, $stateParams, baseUrl, $ionicModal, ContactsService, $ionicPlatform,$cordovaContacts){
  	var $ctrl = this;
    $ctrl.baseUrl = baseUrl;
    $ctrl.newContact = {};
  	AuthFactory.me().then(function(res){
        $ctrl.user = res.data.data;
	  	if (!$ctrl.user){
	  		$state.go('main');
	  	}else {
	  		$ctrl.category = [];
  			$http.post(baseUrl + '/api/categories/item', {'userId': $ctrl.user._id, 'id': $stateParams.id}).then(function(res){
  		    $ctrl.category = res.data;
  		  });
		  }

    $ctrl.selectFromPhone = function(){
      $ionicPlatform.ready(function() {
        navigator.contacts.find(
          [navigator.contacts.fieldType.displayName],
          gotContacts,
          errorHandler);
        function errorHandler(e) {
          console.log("errorHandler: "+e);
        }
        function gotContacts(c) {
          $ctrl.listPhoneContacts = c;
          console.log($ctrl.listPhoneContacts);
          $ionicModal.fromTemplateUrl('js/contacts/selectFromPhone.html', {
            scope: $scope
          }).then(function(modal) {
            $ctrl.selectFromPhone = modal;
            $ctrl.selectFromPhone.show();
          });
        }
        
      });
    }
    $ctrl.selectToModal = function(person) {
      $ctrl.newContact.name = person.displayName;
      $ctrl.selectFromPhone.hide()
    }
    $ctrl.saveNewContact = function() {
        $ctrl.newContact.userId = [$ctrl.user._id];
        $http.post(baseUrl + '/api/contact/add', $ctrl.newContact).then(function(res){
          $ctrl.category.contacts.push(res.data);
          $ctrl.modal.hide()
        });
    }
    $ctrl.showModal = function(){
      $ctrl.listCategories = [];
      $ctrl.contactsList = []
      $http.post(baseUrl + '/api/categories/list', {'userId': $ctrl.user._id}).then(function(res){
        $ctrl.listCategories = res.data;
    
        $ctrl.listCategories.forEach(function(i,index){
          if (i._id == $ctrl.category.category._id){
            $ctrl.selected = i;
          };
        });
      });


      $ionicModal.fromTemplateUrl('js/contacts/addNew.html', {
        scope: $scope
      }).then(function(modal) {
        $ctrl.modal = modal;
        $ctrl.modal.show();
      });
    }

	});
}]);

angular.module('starter').controller('addContact', function ($uibModalInstance, $state, categories, selected) {
  var $ctrl = this;
  $ctrl.contact = {};
  $ctrl.categories = categories;

  $ctrl.categories.forEach(function(i,index){
  	if (i._id == selected._id){
  		$ctrl.selected = i;
  	};
  });

  $ctrl.contact.category = $ctrl.selected._id;
  /*$document.on('click', function(event) {
      $uibModalInstance.dismiss('cancel');
  });
  */
  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $ctrl.createAccount = function(){
    $uibModalInstance.close($ctrl);
    $state.go('signUp')
  }
});