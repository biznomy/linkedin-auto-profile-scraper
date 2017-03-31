
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
});