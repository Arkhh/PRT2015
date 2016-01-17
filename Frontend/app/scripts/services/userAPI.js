/**
 * Created by Thomas on 11/01/2016.
 */
'use strict';

angular.module('BadminTown')
    //searching for and filtering merchants
    .service('UserAPI', function(RequestBuilder) {

        var API_ENDPOINT = 'http://localhost:3000/api';

        function authenticate(userinfo){
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : API_ENDPOINT + '/auth/',
                data           : {
                    'email'      : userinfo.email,
                    'password'      : userinfo.password
                }
            });
        }

        function createUser(userinfo) {
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : API_ENDPOINT + '/users/',
                data           : userinfo
            });
        }

        function getUserInfo(id){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/users/'+id
            });
        }
        /*
        function resetPassword(email){
            return RequestBuilder.getRequestPromise({
                method         : 'DELETE',
                url            : USER_API_ENDPOINT + '/password/' + email
            });
        }*/

        function getRanking(){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/pub/users/'
            });
        }

        function getUserPubInfos(id){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/pub/users/'+id
            });
        }


        function updateUser(userinfo,id) {
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : API_ENDPOINT + '/users/'+id,
                data           : userinfo
            });
        }

        function getUserByName(str){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/search/users/'+str
            });
        }



        return {
            'authenticate'      : authenticate,
            'getUserInfo'		: getUserInfo,
            'getUserPubInfos'	: getUserPubInfos,
            'getUserByName'	: getUserByName,
            'createUser'        : createUser,
            'updateUser'        : updateUser,
            'getRanking'        : getRanking
            //'resetPassword'		: resetPassword
        };

    });