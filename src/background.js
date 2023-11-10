// 通信的对象
let channel = null;
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
  // do something.
  console.log("info: ", info);
  console.log("tab: ", tab);
  if (channel) {
    isOpen = isOpen ? false : true;
    channel.postMessage({ type: isOpen ? "open" : "close", info: info });
  }
});

// 监听插件安装事件
chrome.runtime.onInstalled.addListener(function () {
  console.log("onInstalled");
  chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name === "content-script");
    if (port.name === "content-script") {
      channel = port;
    }
  });
});
