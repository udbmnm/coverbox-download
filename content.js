// 创建控制面板
function createControlPanel() {
  // 创建面板容器
  const panel = document.createElement('div');
  panel.id = 'image-downloader-panel';
  panel.innerHTML = `
    <div class="panel-header">图片下载助手</div>
    <div class="panel-content">

      <div class="input-group">
        <label for="download-folder">保存目录:</label>
        <input type="text" id="download-folder" value="CoverBox">
      </div>
      <button id="start-download-btn">开始下载</button>
      <div id="progress-container" style="display: none; margin-top: 15px;">
        <div class="progress-label">下载进度: <span id="progress-text">0/0</span></div>
        <div class="progress-bar-container">
          <div id="progress-bar"></div>
        </div>
      </div>
      <div class="settings-tip">
        <p>如需静默下载（不弹出保存对话框），请关闭Chrome的"下载前询问保存位置"设置：</p>
        <ol>
          <li>打开 <a href="chrome://settings/downloads" id="settings-link">chrome://settings/downloads</a></li>
          <li>关闭"下载前询问每个文件的保存位置"选项</li>
        </ol>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // 添加拖动功能
  makeDraggable(panel);

  // 添加下载按钮事件
  document.getElementById('start-download-btn').addEventListener('click', async () => {
    const folder = document.getElementById('download-folder').value.trim() || 'CoverBox';
    const imageData = getImageLinks();

    // 检查是否有图片可下载
    if (imageData.length === 0) {
      alert('请先搜索图片');
      return;
    }

    // 显示进度条
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    progressContainer.style.display = 'block';
    progressText.textContent = `0/${imageData.length}`;
    progressBar.style.width = '0%';

    // 开始下载
    await downloadImages(imageData, progressBar, progressText, folder);
  });

  // 处理设置链接点击
  document.getElementById('settings-link').addEventListener('click', (e) => {
    e.preventDefault();
    // 由于安全限制，不能直接在content script中打开chrome://链接
    // 发送消息给background script来打开
    chrome.runtime.sendMessage({
      action: 'openSettings',
      url: 'chrome://settings/downloads'
    });
  });

  // 保存目录输入框的值保存到本地存储
  const folderInput = document.getElementById('download-folder');

  // 从存储中加载保存的目录
  chrome.storage.local.get(['downloadFolder'], (result) => {
    if (result.downloadFolder) {
      folderInput.value = result.downloadFolder;
    }
  });

  // 当输入框值变化时保存
  folderInput.addEventListener('change', () => {
    const folder = folderInput.value.trim() || 'CoverBox';
    chrome.storage.local.set({ downloadFolder: folder });
  });
}

// 使面板可拖动
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const header = element.querySelector('.panel-header');

  if (header) {
    header.onmousedown = dragMouseDown;
  } else {
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e.preventDefault();
    // 获取鼠标位置
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    // 计算新位置
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // 设置元素的新位置
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // 停止移动
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// 获取页面上的图片链接
function getImageLinks() {
  // 获取.result-list下的.list元素中的所有图片
  const listItems = document.querySelectorAll('.result-list .list');
  const imageData = [];

  // 遍历所有列表项
  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];
    const img = item.querySelector('img');
    const albumNameElement = item.querySelector('.album-name');

    if (img && albumNameElement) {
      // 获取原始链接和名称
      let imgSrc = img.src;
      let albumName = albumNameElement.textContent.trim();

      // 处理名称：移除"- Single"并去除前后空格
      albumName = albumName.replace(/- Single/g, '').trim();

      // 处理链接：将200x200bb.jpg替换为3000x3000bb.jpg
      imgSrc = imgSrc.replace(/200x200bb\.jpg/g, '3000x3000bb.jpg');

      imageData.push({
        name: albumName,
        url: imgSrc
      });
    }
  }

  // 在控制台打印结果
  console.log('找到的图片数据:');
  imageData.forEach((item, index) => {
    console.log(`${index + 1}. 名称: ${item.name}, 链接: ${item.url}`);
  });

  if (imageData.length > 0) {
    alert(`找到 ${imageData.length} 个图片，开始下载`);
  }

  return imageData;
}

// 下载图片到本地
async function downloadImages(imageData, progressBar, progressText, folder) {
  const downloadButton = document.getElementById('start-download-btn');
  downloadButton.disabled = true;
  downloadButton.textContent = '下载中...';

  for (let i = 0; i < imageData.length; i++) {
    const item = imageData[i];

    try {
      // 更新进度
      progressText.textContent = `${i+1}/${imageData.length}`;
      progressBar.style.width = `${((i+1) / imageData.length) * 100}%`;

      // 下载图片
      await downloadImage(item.url, item.name, folder);

      // 短暂延迟，避免浏览器过载
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`下载图片 "${item.name}" 失败:`, error);
    }
  }

  downloadButton.disabled = false;
  downloadButton.textContent = '开始下载';
  alert('所有图片下载完成！');
}

// 下载单个图片
function downloadImage(url, filename, folder) {
  return new Promise((resolve, reject) => {
    // 确保文件名不包含非法字符
    filename = filename.replace(/[\\/:*?"<>|]/g, '_');

    // 使用Chrome下载API
    chrome.runtime.sendMessage({
      action: 'download',
      url: url,
      filename: `${folder}/${filename}.jpg`
    }, (response) => {
      if (response && response.success) {
        resolve();
      } else {
        reject(new Error('下载失败: ' + (response?.error || '未知错误')));
      }
    });
  });
}

// 页面加载完成后创建控制面板
window.addEventListener('load', () => {
  // 延迟一点时间确保页面完全加载
  setTimeout(createControlPanel, 1000);
});