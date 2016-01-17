/**
 * Created by Thomas on 13/01/2016.
 */
'use strict';

angular.module('BadminTown')
    //searching for and filtering merchants
    .service('newsAPI', function(RequestBuilder) {

        var API_ENDPOINT = 'http://localhost:3000/api';


        function getNews(){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/news/'
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
            'getNews'      : getNews
            //'getUserInfo'		: getUserInfo,
            //'createUser'        : createUser
            //'resetPassword'		: resetPassword
        };

    });