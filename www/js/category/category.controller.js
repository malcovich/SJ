angular.module('starter')
  .controller('CategoryController', ['$scope', '$log', 'AuthFactory', '$http','$state','$stateParams','baseUrl', function($scope, $log, AuthFactory, $http, $state, $stateParams, baseUrl){
  	var $ctrl = this;
    $ctrl.baseUrl = baseUrl;
  	AuthFactory.me().then(function(res){
        $ctrl.user = res.data.data;
	  	if (!$ctrl.user){
	  		$state.go('main');
	  	}else {
	  		$ctrl.category = [];
			$http.post(baseUrl + '/api/categories/item', {'userId': $ctrl.user._id, 'id': $stateParams.id}).then(function(res){
		    $ctrl.category = res.data;
		  });

		    $ctrl.addContact = function(){
		    	$ctrl.listCategories = [];
		    	$ctrl.contactsList = []
		    	$http.post(baseUrl + '/api/categories/list', {'userId': $ctrl.user._id}).then(function(res){
			      $ctrl.listCategories = res.data;
				    ModalFactory.openAddContactModal('addContact.html', 'addContact', $ctrl.listCategories, $ctrl.category.category).then(function(ctrl){
              $ctrl.contact = ctrl.contact;
					    $ctrl.contact.userId = [$ctrl.user._id];
					    $http.post(baseUrl + '/api/contact/add', $ctrl.contact).then(function(res){
                  console.log($ctrl.category.contacts)
				      		$ctrl.category.contacts.push(res.data)
				      	});
					   }, function () {
					    console.info('Modal dismissed at: ' + new Date());
					});
				});
			}
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