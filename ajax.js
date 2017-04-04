var AJAX = {
    // domain: "http://<domain>:<port>/",
    domain: "http://192.168.1.120:8000/",
    get: function(u, cb) {
        chrome.runtime.sendMessage({
            method: 'GET',
            action: 'xhttp',
            url: AJAX.domain + u
        }, cb);
    },
    post: function(u, d, cb) {
        //console.log(JSON.stringify(d));
        chrome.runtime.sendMessage({
            method: 'POST',
            action: 'xhttp',
            url: AJAX.domain + u,
            data: JSON.stringify(d)
        }, cb);
    },
    put: function(u, d, cb) {
        //console.log(JSON.stringify(d));
        chrome.runtime.sendMessage({
            method: 'PUT',
            action: 'xhttp',
            url: AJAX.domain + u,
            data: JSON.stringify(d)
        }, cb);
    },
    displayResponse: function(r) {
        console.log(r);
        if (r.message) {
            alert(r.message);
        } else {
            alert("Connection Error");
        }
        window.location.reload();
    }
};