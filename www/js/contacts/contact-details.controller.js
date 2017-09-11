angular.module('starter')
  .controller('ContactDetailsController', ['$scope', '$http', '$stateParams', '$log','AuthFactory', 'baseUrl',function($scope, $http, $stateParams, $log, AuthFactory,baseUrl){
	var $ctrl = this;
    $ctrl.baseUrl = baseUrl;
    $ctrl.activeTab = 'More';
    $ctrl.friendHasContact = []

	AuthFactory.me().then(function(res){
        $ctrl.user = res.data.data;

    	var originalId = $stateParams.id;

        $http.post(baseUrl + '/api/friend/list', {'userId': $ctrl.user._id }).then(function(res){
            $ctrl.friendsList = res.data;
            $ctrl.friendsObj = $ctrl.friendsList.map(function(item){
                if(item.useridaccept._id == $ctrl.user._id){
                    return item.useridinvite;
                }else {
                    return item.useridaccept;
                }
            });

            $ctrl.friendsObj.forEach(function(friend){
                if ($ctrl.contact.userId.indexOf(friend._id) > -1){
                   $ctrl.friendHasContact.push(friend)
                }           
            })
            console.log( $ctrl.friendHasContact)
        });

        $ctrl.showHideAddCommentBlock = false;

    	$http.post(baseUrl + '/api/contact/item', {'_id': $stateParams.id}).then(function(res){
           
            $ctrl.contact = res.data[0];
            $ctrl.verifyContacts = res.data.hypothesis;
            $http.post( baseUrl + '/api/contact/commentsList', {id:$ctrl.contact._id}).then(function(res){
                $ctrl.comments = res.data;
            })
            $http.post(baseUrl + '/api/contact/raitingList', {id:$ctrl.contact._id}).then(function(res){
                $ctrl.raitingList = res.data;
                var totalRaiting = 0;
                $ctrl.raitingList.forEach(function(raiting){
                    totalRaiting += raiting.raiting;
                    if (raiting.userId._id == $ctrl.user._id){
                        $ctrl.yourRaiting = raiting.raiting;
                    }
                });
                $ctrl.raiting = totalRaiting/ $ctrl.raitingList.length;
                if ($ctrl.raiting >= 4){
                    $ctrl.rColor = '#38B248';
                }else if($ctrl.raiting >= 3 && $ctrl.raiting < 4){
                    $ctrl.rColor = '#f7981c';
                }
            })
        });

        $ctrl.replaceWithVerify = function(id){
        	$http.post(baseUrl + '/api/contact/verifyContact', {'id': originalId,'verifyId': id, 'userId' : $ctrl.user._id}).then(function(res){
        		console.log('!')
        	})
        };

        $ctrl.addComment = function() {
            $ctrl.comment.contactId = $ctrl.contact._id;
            $ctrl.comment.userId = $ctrl.user._id;
            $ctrl.comment.date = new Date();
            $http.post( baseUrl + '/api/contact/addComment', $ctrl.comment).then(function(res){

            })
        }

        $ctrl.saveRaiting = function(){
            $ctrl.newRaiting.contactId = $ctrl.contact._id;
            $ctrl.newRaiting.userId = $ctrl.user._id;
            $ctrl.newRaiting.date = new Date();
            $http.post(baseUrl + '/api/contact/addRaiting', $ctrl.newRaiting).then(function(res){

            })
        }

        $ctrl.addToContacts = function(){
            $http.post(baseUrl + '/api/contact/addExist', {'userId': $ctrl.user._id,  'id' : originalId}).then(function(res){
               $ctrl.contact = res.data;
            })
        }
        $ctrl.deleteFromContacts = function(){
            $http.post(baseUrl + '/api/contact/deleteExist', {'userId': $ctrl.user._id, 'id' : originalId}).then(function(res){
                $ctrl.contact = res.data;
            })
        }

        // $ctrl.opentMessageModal = function(){
        //     ModalFactory.open('myModalContent.html', 'ModalInstanceCtrl').then(function(ctrl){
        //         console.log(ctrl)
        //         var message = {
        //             "userId" : $ctrl.user._id,
        //             "contactId" : $ctrl.contact._id,
        //             "message" :{
        //                 "text" : ctrl.text,
        //                 "date" : new Date(),
        //                 "author" : $ctrl.user._id
        //             }
        //         }
        //         $http.post(baseUrl + '/api/messages/addMessage', message).then(function(res){

        //         });
        //     }, function () {
        //           console.info('Modal dismissed at: ' + new Date());
        //     });
        // }
    });

}]);
