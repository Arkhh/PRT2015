/**
 * Created by Thomas on 11/01/2016.
 */
angular.module('BadminTown')
    //searching for and filtering merchants
    .service('MatchAPI', function(RequestBuilder) {

        var API_ENDPOINT = 'http://localhost:3000/api';


        function createMatch(matchinfo) {
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : API_ENDPOINT + '/matches/',
                data           : matchinfo
            });
        }

        function getMatchUser(id){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/matches/users/'+id
            });
        }

         function deleteMatch(id){
             return RequestBuilder.getRequestPromise({
                 method         : 'DELETE',
                 url            : API_ENDPOINT + '/matches/'+id
             });
         }



        return {
            'getMatchUser'		: getMatchUser,
            'createMatch'        : createMatch,
            'deleteMatch'		: deleteMatch
        };

    });