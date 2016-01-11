/**
 * Created by Thomas on 11/01/2016.
 */
'use strict';

angular.module('BadminTown')
    //searching for and filtering merchants
    .service('UserAPI', function(RequestBuilder) {

        var USER_API_ENDPOINT = 'http://localhost:3000/api/users';

        function authenticate(username, password){
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : USER_API_ENDPOINT + '/auth',
                data           : {
                    'username'      : username,
                    'password'      : password
                }
            });
        }

        function createUser(userinfo) {
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : USER_API_ENDPOINT,
                data           : userinfo
            });
        }

        function getUserInfo(id){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : USER_API_ENDPOINT + '/users/'+id
            });
        }
        /*
        function resetPassword(email){
            return RequestBuilder.getRequestPromise({
                method         : 'DELETE',
                url            : USER_API_ENDPOINT + '/password/' + email
            });
        }*/



        return {
            'authenticate'      : authenticate,
            'getUserInfo'		: getUserInfo,
            'createUser'        : createUser
            //'resetPassword'		: resetPassword
        };

    });