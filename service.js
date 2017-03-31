var service = {
	personKey : "person",
	// Get request To requestHandler
	get : function(key, id, callback) {
		AJAX.get(key + "/" + id, callback);
	},
	// post request To requestHandler
	save : function(key, data, callback) {
        AJAX.post(key, data, callback);
    },
    // post request to send query to db
    query : function(key, query, callback) {
        AJAX.post(key, {"query" : query}, callback);
    },
    // get person request
	getPerson : function(id, callback) {
		service.get(service.personKey + "/" + id, callback);
	},
	// save person request
    savePerson : function(data, callback) {
        service.save(service.personKey, {"person" : data}, callback);
    },
    // query person request
    queryPerson : function(query, callback) {
        service.query(service.personKey, query, callback);
    }
};