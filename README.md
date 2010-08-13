
pilgrim
=======

JavaScript XHR client for the browser. JSON powered.

synopsis
--------

    var client = new(pilgrim.Client)();

GET /people/42?age=45

    client.path('/people/42').get({ age: 45 }, function (e, data) {
        if (e) {
          // Handle error
        } else {
          // Handle success
        }
    });

PUT /people/47/articles

    client.path('/people/47/articles').put({
        title: "Beast of the East",
        body: "...",
        tags: ['fiction']
    }, function (e, res) {
        // Handle response
    });

using extensions
----------------

    var client = new(pilgrim.Client)({ extension: '.json' });

GET /people/42.json

    client.resource('/people/42').get();

POST /people/42.json/children

    client.resource('/people/42').path('children').post();

GET /people/42

    client.path('/people/42').get();

specifying a host
-----------------

    var client = new(pilgrim.Client)('http://api.domain.com');

specifying headers
------------------

    var client = new(pilgrim.Client)({ headers: { 'X-Header': 'pilgrim' } });

