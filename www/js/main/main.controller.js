angular.module('starter')
  .controller('MainController', ['$scope','AuthFactory','$http','$stateParams','$ionicModal','baseUrl', function($scope, AuthFactory, $http, $stateParams, $ionicModal, baseUrl){
    var $ctrl = this;
    AuthFactory.me().then(function(res){
      $ctrl.user = res.data.data;
		$http.post(baseUrl + '/api/friend/listFriendsRequests',{userId: $ctrl.user._id}).then(function(res,err){
			$ctrl.listRequest = res.data;
			console.log('!', res.data)

		})

		$ctrl.accept = function(id){
			$http.post(baseUrl + '/api/friend/accept',{'_id': id }).then(function(res){
				console.log(res)
			});
		}
    });
}]);

