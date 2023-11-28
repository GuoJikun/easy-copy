let isOpen = false;
// 创建菜单
chrome.contextMenus.create(
  {
    type: "normal",
    title: "开启复制模式",
    id: "menu_easy_copy",
    contexts: ["all"],
  },
  function () {
    console.log("contextMenus are create.");
  }
);
// 菜单的点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  isOpen = isOpen ? false : true;
  chrome.tabs.sendMessage(tab.id, {
    type: isOpen ? "open" : "close",
    info: info,
  });
});

// 监听按键事件
// chrome.scripting.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "keydown") {
//     console.log("Key pressed:", message.key);
//     // 在这里执行你想要的操作
//   }
// });

// 注入到页面的脚本
function injectScript() {
  document.addEventListener("keydown", (event) => {
    console.log("Key pressed:", event.key);
    // chrome.runtime.sendMessage({ type: "keydown", key: event.key });
  });
}
// 注入脚本到所有标签页
chrome.tabs.query({}, (tabs) => {
  tabs.forEach((tab) => {
    const url = new URL(tab.url);
    if (!["https:", "http:"].includes(url.protocol)) return;
    console.log("tab", tab.title, ":", tab.id, tab);
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id, allFrames: false },
        function: injectScript,
      },
      (result) => {
        console.log("result", result);
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log("Script injected successfully");
        }
      }
    );
  });
});
