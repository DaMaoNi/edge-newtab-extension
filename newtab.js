// 随机图片API地址
const RANDOM_IMAGE_API = 'https://picsum.photos/1920/1080';

// DOM 元素
const backgroundImage = document.getElementById('background-image');
const loadingOverlay = document.getElementById('loading');
const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const refreshBtn = document.getElementById('refresh-btn');

// 星期数组
const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

/**
 * 更新时钟显示
 */
function updateClock() {
  const now = new Date();
  
  // 格式化时间 HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  
  // 格式化日期 YYYY年MM月DD日 星期X
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekday = weekdays[now.getDay()];
  dateElement.textContent = `${year}年${month}月${day}日 ${weekday}`;
}

/**
 * 加载随机背景图片
 */
function loadRandomImage() {
  // 显示加载状态
  loadingOverlay.classList.remove('hidden');
  backgroundImage.classList.add('loading');
  refreshBtn.classList.add('loading');
  
  // 添加时间戳防止缓存
  const timestamp = new Date().getTime();
  const imageUrl = `${RANDOM_IMAGE_API}?t=${timestamp}`;
  
  // 创建新图片对象预加载
  const img = new Image();
  
  img.onload = function() {
    // 图片加载成功，更新背景
    backgroundImage.src = imageUrl;
    backgroundImage.classList.remove('loading');
    loadingOverlay.classList.add('hidden');
    refreshBtn.classList.remove('loading');
  };
  
  img.onerror = function() {
    // 图片加载失败，使用备用背景
    console.error('图片加载失败，使用备用背景');
    backgroundImage.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    backgroundImage.classList.remove('loading');
    loadingOverlay.classList.add('hidden');
    refreshBtn.classList.remove('loading');
  };
  
  img.src = imageUrl;
}

/**
 * 使用浏览器默认搜索引擎进行搜索
 */
function handleSearch(query) {
  if (query.trim()) {
    // 使用 chrome.search.query API 调用浏览器默认搜索引擎
    chrome.search.query({ text: query.trim() });
  }
}

/**
 * 初始化
 */
function init() {
  // 更新时钟（每秒更新）
  updateClock();
  setInterval(updateClock, 1000);
  
  // 加载随机图片
  loadRandomImage();
  
  // 刷新按钮点击事件
  refreshBtn.addEventListener('click', function() {
    if (!this.classList.contains('loading')) {
      loadRandomImage();
    }
  });
  
  // 键盘快捷键：按 R 键刷新图片
  document.addEventListener('keydown', function(e) {
    if (e.key === 'r' || e.key === 'R') {
      // 确保不是在输入框中按下的
      if (document.activeElement.tagName !== 'INPUT') {
        loadRandomImage();
      }
    }
  });
  
  // 搜索框聚焦效果
  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('search-form');
  
  searchInput.addEventListener('focus', function() {
    this.parentElement.style.transform = 'translateY(-3px) scale(1.02)';
  });
  
  searchInput.addEventListener('blur', function() {
    this.parentElement.style.transform = '';
  });
  
  // 搜索表单提交事件
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleSearch(searchInput.value);
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
