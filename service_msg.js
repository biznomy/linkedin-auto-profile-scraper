var callback;
function getClipboard() {
    var result = null;
    var textarea = document.getElementById('ta');
    textarea.value = '';
    textarea.select();

    if (document.execCommand('paste')) {
        result = textarea.value;
    } else {
        console.error('failed to get clipboard content');
    }

    textarea.value = '';
    return result;
}

chrome.runtime.onMessage.addListener(function(request,sender,cb) {
    console.log(request.data);
    if(request.method === 'getClipboard') {
        cb(getClipboard());            
    }
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
