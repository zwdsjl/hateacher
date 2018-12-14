var openTab = { id: 0 };
var senderId = 0;
var runing;
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.command == "start") {
            console.log(sender);
            senderId = sender.tab.id;
            runing = setInterval(function () {
                console.log("任务运行中...");
                
                chrome.tabs.get(openTab.id, function (tab) {

                    if (chrome.extension.lastError) {
                        console.log(chrome.extension.lastError);
                        chrome.tabs.sendRequest(senderId, { closed: true }, function (response) {

                        });
                    }
                });

                chrome.tabs.get(senderId, function (tab) {
                    if (chrome.extension.lastError) {
                        console.log(chrome.extension.lastError);
                        clearInterval(runing);
                        console.log("列表页面已关闭任务结束...");
                        
                    }
                });
                //console.log(chrome.extension.lastError);
            }, 5000)
        } else if (request.command == "opentab") {
            chrome.tabs.create({
                url: request.url
            }, function (tab) {
                console.log(tab);
                openTab = tab;
                sendResponse({ farewell: "Open tab OK" });

            });

        } else if (request.command == "closetab") {
            chrome.tabs.remove(openTab.id, function () {
                sendResponse({ farewell: "Close tab OK" });
            });
        }else if(request.command == "finish"){
            clearInterval(runing);
            console.log("所有的课程已学完,任务结束...");
            
        }

    });

// chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
//     console.log(tabId);
//     if (tabId == openTab.id) {
//         chrome.tabs.sendRequest(senderId, { closed: true }, function (response) {

//         });
//     }
// });

