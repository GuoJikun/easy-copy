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
