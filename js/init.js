"use strict";

/* PUT COLLECTION NAME HERE (As ownerId) */
var ownerId = 'tasos';

// TODO load email and pass automatically from GTW.
var user = [];
user.details = [];
user.socialTracker = [];
user.FB = [];
user.FB.data = [];

user.ST = [];
user.ST.sources = 0;

user.email = 'tasos@test.com';
user.password = '123456';
user.hasFB = false;
user.hasST = false;

// Callback handling
// setup the MyRequestCompleted obj
var MyRequestsCompleted = (function MyRequestsCompleted() {
    "use strict";
    var numRequestToComplete,
        requestsCompleted,
        callBacks,
        singleCallBack;

    return function(options) {
        if (!options) options = {};

        numRequestToComplete = options.numRequest || 0;
        requestsCompleted = options.requestsCompleted || 0;
        callBacks = [];
        var fireCallbacks = function () {
            for (var i = 0; i < callBacks.length; i++) callBacks[i]();
        };
        if (options.singleCallback) callBacks.push(options.singleCallback);


        this.addCallbackToQueue = function(isComplete, callback) {
            if (isComplete) requestsCompleted++;
            if (callback) callBacks.push(callback);
            if (requestsCompleted == numRequestToComplete) fireCallbacks();
        };
        this.requestComplete = function(isComplete) {
            if (isComplete) requestsCompleted++;
            if (requestsCompleted == numRequestToComplete) fireCallbacks();
        };
        this.setCallback = function(callback) {
            callBacks.push(callBack);
        };
    };
})();