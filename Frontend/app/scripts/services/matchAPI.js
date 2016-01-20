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

        function updateResult(updateInfo) {
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : API_ENDPOINT + '/result/matches',
                data           : updateInfo
            });
        }

        function updateMatch(updatedInfos) {
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : API_ENDPOINT + '/matches/'+updatedInfos.id,
                data           : updatedInfos
            });
        }

        function noterAdv(idNoteur,idm,noteInfos,idNote) {
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : API_ENDPOINT + '/notation/'+idNote,
                data           : {
                    idJ: idNoteur,
                    idm: idm,
                    note: noteInfos.note,
                    nomSkill: noteInfos.nom
                }
            });
        }

        function getNextFive(idm,id) {
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : API_ENDPOINT + '/unvalid/usersnext/matches',
                data           : {
                    id: id,
                    idm: idm
                }
            });
        }

        function getSuggestion(id){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/suggest/'+id
            });
        }

        function getMatchUser(id){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/unvalid/matches/users/'+id
            });
        }

        function getLastTen(id){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/histo/users/'+id
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
            'deleteMatch'		: deleteMatch,
            'getLastTen'		: getLastTen,
            'noterAdv'		    : noterAdv,
            'getSuggestion'		: getSuggestion,
            'getNextFive'		: getNextFive,
            'updateMatch'		: updateMatch,
            'updateResult'      : updateResult
        };

    });