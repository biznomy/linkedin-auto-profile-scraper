var callback;
chrome.runtime.onMessage.addListener(function(request,sender,cb) {
    console.log(request.data);
  if (request.action == "xhttp") {
    $.ajax({
        type: request.method,
        url: request.url,
        contentType: "application/json; charset=utf-8",
        data: request.data,
        success:cb,
        error:cb
    });
    return true; 
  }
  if (request.from == 'content_script') {
    // cb(chrome.tabs);
    callback = cb;
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        alert("tab updated");
        // callback(changeInfo);
    });
    return true;
  }
});

// chrome.tabs.onUpdated.addListener(function() {
//   alert('updated from background');
// });
