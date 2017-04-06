var typeahead = {
    create: function(elm, callback) {
        console.log("create");
        $(elm).keyup(function() {
            console.log("change");
            callback(elm);
            // typeahead.doRequest(elm, panel);
        });
    },
    doRequest: function(elm) {
        service.queryPerson({
            "name": {
                '$regex': $(elm).val()
            }
        }, function(r) {
            console.log(r);
        });
    }
};
