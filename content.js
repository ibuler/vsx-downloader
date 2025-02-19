function addDownloadLinks() {
    // 从 URL 获取 itemName
    const urlParams = new URLSearchParams(window.location.search);
    const itemName = urlParams.get('itemName');
    console.log('[Debug] 从 URL 获取的 itemName:', itemName);
    
    if (!itemName) {
        console.log('[Debug] itemName 为空，退出函数');
        return;
    }
    
    // 分割 itemName
    const [fieldA, fieldB] = itemName.split('.');
    console.log('[Debug] 分割后的字段:', { fieldA, fieldB });
    
    // 获取最新版本
    const versionElement = document.querySelector('[role="definition"][aria-labelledby="version"]');
    console.log('[Debug] 版本元素:', versionElement);
    const latestVersion = versionElement?.textContent?.trim();
    console.log('[Debug] 最新版本号:', latestVersion);
    
    if (!latestVersion) {
        console.log('[Debug] 未找到版本号，退出函数');
        return;
    }

    // 在安装按钮容器中添加下载链接
    const installButtonContainer = document.querySelector('.ux-oneclick-install-button-container');
    console.log('[Debug] 安装按钮容器:', installButtonContainer);
    if (installButtonContainer && !installButtonContainer.querySelector('.download-link')) {
        const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${fieldA}/vsextensions/${fieldB}/${latestVersion}/vspackage`;
        console.log('[Debug] 生成的下载链接:', downloadUrl);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.className = 'download-link';
        downloadLink.innerHTML = 'Download VSIX';
        
        const linkContainer = document.createElement('span');
        linkContainer.style.display = 'inline-block';
        linkContainer.className = 'installHelpInfo'
        linkContainer.appendChild(downloadLink);
        
        installButtonContainer.appendChild(linkContainer);
        console.log('[Debug] 下载链接已添加到安装按钮容器');
    }

    // 创建详情页下载链接
    const resourcesSection = document.querySelector('.resources-section');
    console.log('[Debug] 资源区域元素:', resourcesSection);
    if (resourcesSection) {
        // 检查是否已存在下载链接
        const existingLink = resourcesSection.querySelector('.download-link');
        console.log('[Debug] 已存在的下载链接:', existingLink);
        
        if (!existingLink) {
            const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${fieldA}/vsextensions/${fieldB}/${latestVersion}/vspackage`;
            console.log('[Debug] 生成的下载链接:', downloadUrl);
            
            const downloadLink = document.createElement('div');
            downloadLink.className = 'item';
            downloadLink.innerHTML = `
                <a href="${downloadUrl}" class="download-link">
                    <span class="icon">⬇️</span>
                    <span>Download VSIX</span>
                </a>
            `;
            
            resourcesSection.appendChild(downloadLink);
            console.log('[Debug] 下载链接已添加到资源区域');
        }
    }

    // 为版本历史添加下载链接
    const versionRows = document.querySelectorAll('#versionHistoryTab tbody tr');
    console.log('[Debug] 找到的版本历史行数:', versionRows.length);
    
    versionRows.forEach((row, index) => {
        const versionCell = row.querySelector('td');
        if (versionCell && !versionCell.querySelector('a')) {
            const version = versionCell.textContent.trim();
            console.log(`[Debug] 处理第 ${index + 1} 行版本号:`, version);
            
            const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${fieldA}/vsextensions/${fieldB}/${version}/vspackage`;
            
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.textContent = 'Download VSIX';
            downloadLink.style.marginLeft = '10px';
            
            versionCell.appendChild(downloadLink);
            console.log(`[Debug] 已为版本 ${version} 添加下载链接`);
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Debug] DOMContentLoaded 事件触发');
    addDownloadLinks();
});

// 为了处理动态加载的内容，也可以使用 MutationObserver
const observer = new MutationObserver((mutations) => {
    console.log('[Debug] MutationObserver 检测到 DOM 变化');
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            console.log('[Debug] 检测到新节点添加，重新执行 addDownloadLinks');
            addDownloadLinks();
            break;
        }
    }
});

console.log('[Debug] 开始观察 DOM 变化');
observer.observe(document.body, {
    childList: true,
    subtree: true
});