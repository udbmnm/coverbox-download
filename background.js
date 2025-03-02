chrome.action.onClicked.addListener((tab) => {
  // 点击插件图标时打开指定网页
  chrome.tabs.create({ url: "http://coverbox.henry-hu.com" });
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download') {
    // 使用chrome.downloads API下载文件
    chrome.downloads.download({
      url: request.url,
      filename: request.filename, // 使用传递过来的完整路径
      conflictAction: 'uniquify', // 如果文件已存在，自动重命名
      saveAs: false // 静默下载，不显示保存对话框
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError });
      } else {
        // 监听下载完成事件
        chrome.downloads.onChanged.addListener(function downloadListener(delta) {
          if (delta.id === downloadId && delta.state) {
            if (delta.state.current === 'complete') {
              // 下载完成，移除监听器
              chrome.downloads.onChanged.removeListener(downloadListener);
              sendResponse({ success: true, downloadId: downloadId });
            } else if (delta.state.current === 'interrupted') {
              // 下载中断，移除监听器
              chrome.downloads.onChanged.removeListener(downloadListener);
              sendResponse({ success: false, error: '下载中断' });
            }
          }
        });
      }
    });

    // 返回true表示将异步发送响应
    return true;
  } else if (request.action === 'openSettings') {
    // 打开Chrome设置页面
    chrome.tabs.create({ url: request.url });
  }
});