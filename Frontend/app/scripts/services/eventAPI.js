/**
 * Created by Thomas on 11/01/2016.
 */

angular.module('BadminTown')
    //searching for and filtering merchants
    .service('EventAPI', function(RequestBuilder) {

        var API_ENDPOINT = 'http://localhost:3000/api';

        function createEvent(eventInfo) {
            return RequestBuilder.getRequestPromise({
                method         : 'POST',
                url            : API_ENDPOINT + '/events/',
                data           : eventInfo
            });
        }

        function getEvents(){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/events/'
            });
        }

        function getEventById(id){
            return RequestBuilder.getRequestPromise({
                method         : 'GET',
                url            : API_ENDPOINT + '/events/'+id
            });
        }



        return {
            'getEvents'		: getEvents,
            'getEventById'		: getEventById,
            'createEvent'        : createEvent
        };

    });