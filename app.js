// 多语言配置
const translations = {
    en: {
        pageTitle: 'Earth Atlas Collection',
        appTitle: 'Earth Atlas Collection',
        avatarAlt: 'User Avatar',
        cameraText: 'Take Photo / Upload',
        totalCount: 'Total Atlas',
        loadingText: 'Loading...',
        aiLoadingText: 'AI is generating atlas...',
        shareText: 'Share',
        downloadText: 'Download',
        viewerAlt: 'Atlas Details',
        linkCopied: 'Link copied to clipboard',
        shareCancel: 'Share cancelled',
        specimen: 'Specimen',
        atlas: 'Atlas #',
        delete: 'Delete',
        deleteConfirmTitle: 'Confirm Deletion',
        deleteConfirmMsg: 'Are you sure you want to delete this item? This action cannot be undone.',
        cancel: 'Cancel',
        deleteSuccess: 'Deletion successful',
        emptyStateText: 'Capture the world around you and create your personal atlas with AI. Tap the Camera button to start your amazing collection!'
    },
    zh: {
        pageTitle: '地球图鉴收集',
        appTitle: '地球图鉴收集',
        avatarAlt: '用户头像',
        cameraText: '拍照 / 上传图片',
        totalCount: '图鉴总数',
        loadingText: '加载中...',
        aiLoadingText: 'AI正在生成图鉴...',
        shareText: '分享',
        downloadText: '下载',
        viewerAlt: '图鉴详情',
        linkCopied: '链接已复制到剪贴板',
        shareCancel: '分享取消',
        specimen: '标本',
        atlas: '图鉴 #',
        delete: '删除',
        deleteConfirmTitle: '确认删除',
        deleteConfirmMsg: '您确定要删除这个项目吗？此操作无法撤销。',
        cancel: '取消',
        deleteSuccess: '删除成功',
        emptyStateText: '拍下身边的万物，用 AI 创造你的专属图鉴。点击拍照按钮，开始你的奇妙收集之旅吧！'
    },
    ja: {
        pageTitle: '地球図鑑コレクション',
        appTitle: '地球図鑑コレクション',
        avatarAlt: 'ユーザーアバター',
        cameraText: '写真撮影 / アップロード',
        totalCount: '図鑑総数',
        loadingText: '読み込み中...',
        aiLoadingText: 'AIが図鑑を生成中...',
        shareText: 'シェア',
        downloadText: 'ダウンロード',
        viewerAlt: '図鑑詳細',
        linkCopied: 'リンクをクリップボードにコピーしました',
        shareCancel: 'シェアがキャンセルされました',
        specimen: '標本',
        atlas: '図鑑 #',
        delete: '削除',
        deleteConfirmTitle: '削除の確認',
        deleteConfirmMsg: 'このアイテムを削除してもよろしいですか？この操作は元に戻せません。',
        cancel: 'キャンセル',
        deleteSuccess: '削除に成功しました',
        emptyStateText: '身の回りのあらゆるものを撮影し、AIであなただけの図鑑を作りましょう。撮影ボタンをタップして、素敵な収集の旅を始めましょう！'
    }
};

// 应用主逻辑
class EarthAtlasApp {
    constructor() {
        // 使用Cloudinary托管的测试图片
        this.testImageUrl = 'https://res.cloudinary.com/dnhjgceru/image/upload/v1758385529/Gemini_Generated_Image_xhl9g2xhl9g2xhl9_n7bqwx.png';
        this.galleryData = [];
        this.currentImageIndex = 0;
        this.isLoading = false;
        this.page = 1;
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLanguageSwitcher();
        this.updateTexts();
        this.loadInitialGallery();
        this.setupInfiniteScroll();
        this.setupMobileGestures();
        this.setupBackToTopButton();
    }

    updateEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const galleryGrid = document.getElementById('galleryGrid');
        if (this.galleryData.length === 0) {
            emptyState.style.display = 'flex';
            galleryGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            galleryGrid.style.display = 'grid';
        }
    }

    // 设置语言切换器
    setupLanguageSwitcher() {
        const languageButtons = document.querySelectorAll('.language-btn');
        
        // 设置当前语言状态
        languageButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLanguage) {
                btn.classList.add('active');
            }
        });

        // 绑定点击事件
        languageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchLanguage(btn.dataset.lang);
            });
        });
    }

    // 切换语言
    switchLanguage(language) {
        if (language !== this.currentLanguage) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            
            // 更新语言按钮状态
            document.querySelectorAll('.language-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.lang === language) {
                    btn.classList.add('active');
                }
            });
            
            // 更新页面文本
            this.updateTexts();
            
            // 重新渲染图库（更新文本）
            this.renderGallery();
        }
    }

    // 更新页面文本
    updateTexts() {
        const t = translations[this.currentLanguage];
        
        // 更新页面标题
        document.getElementById('page-title').textContent = t.pageTitle;
        document.title = t.pageTitle;
        
        // 更新应用标题
        document.getElementById('app-title').textContent = t.appTitle;
        
        // 更新头像alt
        document.getElementById('avatar-alt').alt = t.avatarAlt;
        
        // 更新拍照文本
        document.getElementById('camera-text').textContent = t.cameraText;
        
        // 更新统计标签
        document.getElementById('totalCountLabel').textContent = t.totalCount;
        
        // 更新加载文本
        const loadingTextEl = document.getElementById('loading-text');
        if (loadingTextEl) {
            loadingTextEl.textContent = t.loadingText;
        }
        
        // 更新AI加载文本
        const aiLoadingTextEl = document.getElementById('ai-loading-text');
        if (aiLoadingTextEl) {
            aiLoadingTextEl.textContent = t.aiLoadingText;
        }
        
        // 更新分享和下载文本
        const shareTextEl = document.getElementById('share-text');
        if (shareTextEl) {
            shareTextEl.textContent = t.shareText;
        }
        
        const downloadTextEl = document.getElementById('download-text');
        if (downloadTextEl) {
            downloadTextEl.textContent = t.downloadText;
        }
        
        // 更新图片查看器alt
        const viewerImageEl = document.getElementById('viewerImage');
        if (viewerImageEl) {
            viewerImageEl.alt = t.viewerAlt;
        }

        // 更新删除按钮和弹窗文本
        document.getElementById('delete-text').textContent = t.delete;
        document.getElementById('confirm-title').textContent = t.deleteConfirmTitle;
        document.getElementById('confirm-message').textContent = t.deleteConfirmMsg;
        document.getElementById('confirmCancelBtn').textContent = t.cancel;
        document.getElementById('confirmOkBtn').textContent = t.delete;

        // 更新空状态文本
        const emptyStateTextEl = document.getElementById('emptyStateText');
        if (emptyStateTextEl) {
            emptyStateTextEl.textContent = t.emptyStateText;
        }
    }

    setupEventListeners() {
        // 上传按钮点击
        const uploadBtn = document.getElementById('uploadBtn');
        const fileInput = document.getElementById('fileInput');

        uploadBtn.addEventListener('click', () => {
            // 检测是否为移动设备
            if (this.isMobileDevice()) {
                // 移动设备上，直接触发文件选择（会显示拍照/相册选项）
                fileInput.setAttribute('capture', 'environment');
            }
            fileInput.click();
        });

        // 文件选择处理
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file);
            }
            // 重置input，允许重复选择同一文件
            fileInput.value = '';
        });

        // 图片查看器关闭按钮
        document.getElementById('viewerClose').addEventListener('click', () => {
            this.closeImageViewer();
        });

        // ESC键关闭查看器
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImageViewer();
            }
            // 左右箭头切换图片
            if (document.getElementById('imageViewer').style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    this.navigateImage(-1);
                } else if (e.key === 'ArrowRight') {
                    this.navigateImage(1);
                }
            }
        });

        // 分享、下载和删除按钮
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareImage();
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadImage();
        });


        // 点击背景关闭查看器
        const overlay = document.querySelector('.viewer-overlay');
        overlay.addEventListener('click', () => {
            this.closeImageViewer();
        });
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    handleImageUpload(file) {
        // 显示加载动画
        this.showLoadingAnimation();

        // 模拟AI处理，3秒后显示结果
        setTimeout(() => {
            // 添加新图片到图库
            const newImage = {
                id: Date.now(),
                url: this.testImageUrl,
                title: 'Calotes versicolor',
                description: this.currentLanguage === 'zh' ? '变色树蜥' : this.currentLanguage === 'ja' ? '変色トカゲ' : 'Changeable Lizard',
                size: this.getRandomSize(),
                timestamp: new Date()
            };

            // 添加到数组开头
            this.galleryData.unshift(newImage);
            
            // 隐藏加载动画
            this.hideLoadingAnimation();
            
            // 显示图片查看器
            this.openImageViewer(0);
            
            // 更新图库显示
            this.renderGallery();
        }, 3000);
    }

    showLoadingAnimation() {
        const modal = document.getElementById('loadingModal');
        modal.style.display = 'flex';
        
        // 重新触发动画
        const icons = modal.querySelectorAll('.icon');
        icons.forEach((icon, index) => {
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = `iconPulse 2s ease-in-out infinite ${index * 0.2}s`;
            }, 10);
        });
    }

    hideLoadingAnimation() {
        const modal = document.getElementById('loadingModal');
        modal.style.display = 'none';
    }

    loadInitialGallery() {
        // 生成初始测试数据
        for (let i = 0; i < 20; i++) {
            this.galleryData.push({
                id: Date.now() + i,
                url: this.testImageUrl,
                title: `${translations[this.currentLanguage].specimen} ${i + 1}`,
                description: `${translations[this.currentLanguage].atlas}${i + 1}`,
                size: this.getRandomSize(),
                timestamp: new Date(Date.now() - i * 86400000)
            });
        }
        this.renderGallery(this.galleryData, true); // Initial render, clear the grid
        // 初始加载后，检查是否需要填充更多内容
        this.checkAndLoadUntilScrollable();
    }

    getRandomSize() {
        const sizes = ['1x1', '1x1', '1x1', '2x1', '2x2'];
        return sizes[Math.floor(Math.random() * sizes.length)];
    }

    renderGallery(itemsToRender, clear = false) {
        const grid = document.getElementById('galleryGrid');
        if (clear) {
            grid.innerHTML = '';
        }

        itemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = `gallery-card size-${item.size} is-loading`; // Add is-loading class for skeleton effect

            // 创建实际显示的img元素
            const displayImg = document.createElement('img');
            displayImg.alt = item.title;
            displayImg.loading = 'lazy';
            
            // 先添加到DOM
            card.appendChild(displayImg);
            
            // 创建预加载的Image对象
            const preloadImg = new Image();
            preloadImg.onload = () => {
                // 图片加载成功后，设置显示图片的src并移除loading状态
                displayImg.src = preloadImg.src;
                // 使用requestAnimationFrame确保DOM更新后再移除loading类
                requestAnimationFrame(() => {
                    card.classList.remove('is-loading');
                });
            };
            preloadImg.onerror = () => {
                // 图片加载失败时也要移除loading状态，避免一直显示骨架屏
                console.error('Failed to load image:', item.url);
                card.classList.remove('is-loading');
                displayImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDNIM0MxLjkgMyAxIDMuOSAxIDVWMTlDMSAyMC4xIDEuOSAyMSAzIDIxSDIxQzIyLjEgMjEgMjMgMjAuMSAyMyAxOVY1QzIzIDMuOSAyMi4xIDMgMjEgM1pNNSAxN0w4LjUgMTIuNUwxMSAxNUwxNC41IDEwLjVMMTkgMTdINVoiIGZpbGw9IiNjY2MiLz4KPC9zdmc+'; // 默认占位图
            };
            // 开始预加载
            preloadImg.src = item.url;

            card.addEventListener('click', () => {
                // Find the index of the clicked item in the main data array
                const itemIndex = this.galleryData.findIndex(galleryItem => galleryItem.id === item.id);
                if (itemIndex > -1) {
                    this.openImageViewer(itemIndex);
                }
            });

            grid.appendChild(card);
        });

        // Update stats and empty state after rendering
        this.updateStats();
        this.updateEmptyState();
    }

    updateStats() {
        const totalCountElement = document.getElementById('totalCount');
        if (totalCountElement) {
            totalCountElement.textContent = this.galleryData.length;
        }
    }

    openImageViewer(index) {
        this.currentImageIndex = index;
        const viewer = document.getElementById('imageViewer');
        const image = this.galleryData[index];

        // 设置图片和信息
        document.getElementById('viewerImage').src = image.url;
        document.getElementById('viewerTitle').textContent = image.title;
        document.getElementById('viewerDesc').textContent = image.description;

        // 渲染缩略图
        this.renderThumbnails();

        // Attach delete listener here to ensure the button exists
        const deleteBtn = document.getElementById('deleteBtn');
        // Clone and replace to remove any old listeners
        const newDeleteBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
        newDeleteBtn.addEventListener('click', () => {
            this.deleteCurrentImage();
        });

        // 显示查看器
        viewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeImageViewer() {
        const viewer = document.getElementById('imageViewer');
        viewer.style.display = 'none';
        document.body.style.overflow = '';
    }

    renderThumbnails() {
        const container = document.getElementById('viewerThumbnails');
        container.innerHTML = '';

        // 只显示当前图片附近的缩略图
        const start = Math.max(0, this.currentImageIndex - 3);
        const end = Math.min(this.galleryData.length, start + 7);

        for (let i = start; i < end; i++) {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            if (i === this.currentImageIndex) {
                thumb.classList.add('active');
            }
            thumb.innerHTML = `<img src="${this.galleryData[i].url}" alt="">`;
            thumb.addEventListener('click', () => {
                this.currentImageIndex = i;
                this.updateViewer();
            });
            container.appendChild(thumb);
        }
    }

    updateViewer() {
        const image = this.galleryData[this.currentImageIndex];
        document.getElementById('viewerImage').src = image.url;
        document.getElementById('viewerTitle').textContent = image.title;
        document.getElementById('viewerDesc').textContent = image.description;
        this.renderThumbnails();
    }

    navigateImage(direction) {
        const newIndex = this.currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < this.galleryData.length) {
            this.currentImageIndex = newIndex;
            this.updateViewer();
        }
    }

    shareImage() {
        const image = this.galleryData[this.currentImageIndex];
        
        if (navigator.share) {
            // 使用原生分享API（移动端）
            navigator.share({
                title: image.title,
                text: image.description,
                url: window.location.href
            }).catch(err => console.log(translations[this.currentLanguage].shareCancel));
        } else {
            // 复制链接到剪贴板
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = window.location.href;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            
            // 显示提示
            this.showToast(translations[this.currentLanguage].linkCopied);
        }
    }

    downloadImage() {
        const image = this.galleryData[this.currentImageIndex];
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `${image.title}.png`;
        link.click();
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 3000;
            animation: slideUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    setupInfiniteScroll() {
        const galleryContainer = document.querySelector('.gallery-container');
        const scrollTarget = window.innerWidth <= 768 ? window : galleryContainer;

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (this.shouldLoadMore(galleryContainer)) {
                        this.loadMoreImages();
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        scrollTarget.addEventListener('scroll', handleScroll);
    }

    // 检查并加载直到内容可滚动
    async checkAndLoadUntilScrollable() {
        // 等待一小段时间，确保DOM渲染完成
        await new Promise(resolve => setTimeout(resolve, 100));

        const galleryContainer = document.querySelector('.gallery-container');
        const isMobile = window.innerWidth <= 768;
        const scrollElement = isMobile ? document.documentElement : galleryContainer;

        // 只要内容高度不足以撑满容器，就继续加载
        while (scrollElement.scrollHeight <= scrollElement.clientHeight && !this.isLoading) {
            console.log('Content does not fill the screen, loading more...');
            await this.loadMoreImages();
            // 每次加载后都短暂等待，给DOM渲染时间
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    shouldLoadMore(container) {
        const isMobile = window.innerWidth <= 768;
        const scrollElement = isMobile ? document.documentElement : container;
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;

        // 修复：PC端使用容器的clientHeight，移动端使用窗口的innerHeight
        const currentClientHeight = isMobile ? window.innerHeight : clientHeight;

        // 边界情况：如果内容不足以产生滚动条，scrollHeight可能约等于clientHeight
        if (scrollHeight <= currentClientHeight) {
            return true; // 应该加载更多
        }

        return scrollTop + currentClientHeight >= scrollHeight - 200 && !this.isLoading;
    }

    loadMoreImages() {
        return new Promise(resolve => {
            if (this.isLoading) {
                resolve();
                return;
            }
            
            this.isLoading = true;
            const loadingIndicator = document.getElementById('loadingMore');
            loadingIndicator.style.display = 'flex';

            // 模拟加载更多数据
            setTimeout(() => {
                const startIndex = this.galleryData.length;
                const newItems = [];
                for (let i = 0; i < 10; i++) {
                    const newItem = {
                        id: Date.now() + i,
                        url: this.testImageUrl,
                        title: `${translations[this.currentLanguage].specimen} ${startIndex + i + 1}`,
                        description: `${translations[this.currentLanguage].atlas}${startIndex + i + 1}`,
                        size: this.getRandomSize(),
                        timestamp: new Date()
                    };
                    this.galleryData.push(newItem);
                    newItems.push(newItem);
                }
                
                this.renderGallery(newItems, false); // Append new items, do not clear
                loadingIndicator.style.display = 'none';
                this.isLoading = false;
                resolve(); // 数据加载和渲染完成，Promise解决
            }, 1000);
        });
    }

    setupMobileGestures() {
        if (!this.isMobileDevice()) return;

        let touchStartX = 0;
        let touchEndX = 0;
        
        const viewer = document.getElementById('viewerImage');
        
        viewer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        viewer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // 向左滑动 - 下一张
                    this.navigateImage(1);
                } else {
                    // 向右滑动 - 上一张
                    this.navigateImage(-1);
                }
            }
        };

        // 双击缩放
        let lastTap = 0;
        viewer.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                e.preventDefault();
                // 双击逻辑 - 可以实现图片缩放
                this.toggleZoom();
            }
            lastTap = currentTime;
        });
    }

    toggleZoom() {
        const image = document.getElementById('viewerImage');
        if (image.style.transform === 'scale(2)') {
            image.style.transform = 'scale(1)';
            image.style.cursor = 'zoom-in';
        } else {
            image.style.transform = 'scale(2)';
            image.style.cursor = 'zoom-out';
        }
    }

    // 设置返回顶部按钮
    setupBackToTopButton() {
        const backToTopBtn = document.getElementById('backToTopBtn');
        if (!backToTopBtn) return;

        const galleryContainer = document.querySelector('.gallery-container');
        // 根据设备类型选择滚动监听对象
        const scrollTarget = window.innerWidth <= 768 ? window : galleryContainer;
        const scrollElement = window.innerWidth <= 768 ? document.documentElement : galleryContainer;

        const handleScroll = () => {
            if (scrollElement.scrollTop > window.innerHeight / 2) { // 阈值调整为半屏高度，更快出现
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        };

        scrollTarget.addEventListener('scroll', handleScroll);

        backToTopBtn.addEventListener('click', () => {
            scrollElement.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    async deleteCurrentImage() {
        const confirmed = await this.showConfirmModal();
        if (confirmed) {
            // Remove the image from the data array
            this.galleryData.splice(this.currentImageIndex, 1);

            // Close the viewer
            this.closeImageViewer();

            // Re-render the entire gallery
            this.renderGallery(this.galleryData, true);

            // Show success toast
            this.showToast(translations[this.currentLanguage].deleteSuccess);
        }
    }

    showConfirmModal() {
        return new Promise(resolve => {
            const modal = document.getElementById('confirmModal');
            const cancelBtn = document.getElementById('confirmCancelBtn');
            const okBtn = document.getElementById('confirmOkBtn');
            const overlay = modal.querySelector('.viewer-overlay');

            modal.style.display = 'flex';

            const close = (result) => {
                modal.style.display = 'none';
                // Clean up listeners
                cancelBtn.onclick = null;
                okBtn.onclick = null;
                overlay.onclick = null;
                resolve(result);
            };

            cancelBtn.onclick = () => close(false);
            okBtn.onclick = () => close(true);
            overlay.onclick = () => close(false);
        });
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new EarthAtlasApp();
});
