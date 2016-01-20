/**
 * Created by Thomas on 11/01/2016.
 */
angular.module('BadminTown')
    //searching for and filtering merchants
    .service('AdminAPI', function(RequestBuilder) {

        var API_ENDPOINT = 'http://localhost:3000/api';

        function getAllUsersInfos() {
            return RequestBuilder.getRequestPromise({
                method: 'GET',
                url: API_ENDPOINT + '/users/'
            });
        }

        function editAdminStatus(id,status){
            return RequestBuilder.getRequestPromise({
                method: 'POST',
                url: API_ENDPOINT + '/users/'+id,
                data: {
                    admin: status
                }
            });
        }

        return {
            'getAllUsersInfos'      : getAllUsersInfos,
            'editAdminStatus'		: editAdminStatus

        };
});