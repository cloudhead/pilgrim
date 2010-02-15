
=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

### This is a work in progress

pilgrim
=======

Javascript REST client for the browser.

synopsis
--------

    var client = new(pilgrim.Client)({mime: 'application/json'});

GET /people/42?age=45

    client.resource('people')
           .id(42).get({ age: 45 })(function (data) {
        // Handle Success 
    }, function (err) {
        // Handle Error  
    });

PUT /people/47/articles

    client.resource('people').id(47)
           .resource('articles').put({
        title: "Beast of the East",
        body: "...",
        tags: ['fiction']
    })(function (res) {
        // Success
    });

