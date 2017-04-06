function hello() {
    chrome.tabs.executeScript({
        file: 'reload.js'
    });
}

document.getElementById('mydivtoclicky').addEventListener('click', hello);