// ==UserScript==
// @name         知网-文献-bibtex提取
// @description  从知网文献中直接复制bibtex
// @author       BN_Dou
// @version      4.0.0
// @namespace    https://github.com/BNDou/getCnkiLiteratureBibTex
// @match        https://greasyfork.org/zh-CN/users/883089-bndou
// @match        https://kns.cnki.net/kcms2/article/abstract?v=*
// @match        https://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @match        http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @match        https://kns.cnki.net/kns8s/AdvSearch*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.cnki.net/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/444428/%E7%9F%A5%E7%BD%91-%E6%96%87%E7%8C%AE-bibtex%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444428/%E7%9F%A5%E7%BD%91-%E6%96%87%E7%8C%AE-bibtex%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 样式定义
    const STYLES = {
        button: `
            width: 85px;
            height: 32px;
            border-radius: 16px;
            background-color: #E3170D;
            border: none;
            color: white;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(227, 23, 13, 0.3);
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        `,
        advSearchButton: `
            width: auto;
            height: 24px;
            padding: 0 8px;
            border-radius: 4px;
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            color: #E3170D;
            font-size: 12px;
            font-weight: normal;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-right: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 2px;
        `,
        successAnimation: `
            @keyframes successPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `
    };

    let bibtex = '';

    // 创建并注入样式
    function injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = STYLES.successAnimation;
        document.head.appendChild(styleSheet);
    }

    // 创建按钮
    function createButton(isAdvSearch = false) {
        const button = document.createElement('button');
        button.id = "bibbtn";
        button.title = "点击复制BibTex";
        button.innerHTML = '<span>📋 BibTex</span>';
        button.style.cssText = isAdvSearch ? STYLES.advSearchButton : STYLES.button;
        
        if (isAdvSearch) {
            // 高级检索页面的悬停效果
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#e8e8e8';
                button.style.borderColor = '#ccc';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#f0f0f0';
                button.style.borderColor = '#ddd';
            });
        } else {
            // 原有页面的悬停效果
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#B31208';
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 12px rgba(227, 23, 13, 0.4)';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#E3170D';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 8px rgba(227, 23, 13, 0.3)';
            });
        }

        return button;
    }

    // 显示复制成功提示
    function showCopySuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<span>✅ 已复制</span>';
        button.style.animation = 'successPulse 0.5s ease';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.animation = '';
        }, 1500);
    }

    // 获取BibTex数据
    async function getBibTex(filename = null) {
        try {
            let params;
            if (filename) {
                // 高级检索页面的情况
                params = {
                    FileName: filename,
                    DisplayMode: 'BibTex',
                    OrderParam: 0,
                    OrderType: 'desc',
                };
            } else {
                // 默认情况
                params = {
                    FileName: document.getElementById("paramdbname").getAttribute("value") + '!' + 
                             document.getElementById("paramfilename").getAttribute("value") + '!1!0',
                    DisplayMode: 'BibTex',
                    OrderParam: 0,
                    OrderType: 'desc',
                };
            }

            const response = await fetch('https://kns.cnki.net/dm/api/ShowExport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://kns.cnki.net/dm/manage/export.html',
                },
                body: new URLSearchParams(params),
            });

            const data = await response.text();
            
            // 提取所有<li>标签中的内容
            const bibtexEntries = data.match(/<li>([\s\S]*?)<\/li>/g)
                                    ?.map(entry => entry.replace(/<\/?li>/g, ''))          // 移除<li>标签
                                    ?.map(entry => entry.replace(/<br>/g, '\n'))          // 将<br>替换为换行
                                    ?.map(entry => entry.replace(/\n\s+/g, '\n'))         // 清理每行开头的空白
                                    ?.map(entry => entry.replace(/^\s+|\s+$/g, ''))       // 仅清理首尾空白
                                    ?.join('\n\n');                                       // 用两个换行符连接多个条目
            
            if (!bibtexEntries) {
                throw new Error('未找到BibTeX数据');
            }
            
            return bibtexEntries;
        } catch (error) {
            console.error('获取BibTex失败:', error);
            return null;
        }
    }

    // 复制BibTex到剪贴板
    async function copyBibTex(buttonId = 'bibbtn', filename = null) {
        const bibtexContent = await getBibTex(filename);
        if (bibtexContent) {
            GM_setClipboard(bibtexContent);
            showCopySuccess(document.getElementById(buttonId));
        }
    }

    // 初始化
    function initialize() {
        injectStyles();
        
        // 添加菜单按钮
        GM_registerMenuCommand('📋 复制BibTex', () => copyBibTex());

        // 根据页面URL决定按钮添加位置
        const currentURL = window.location.href;

        if (currentURL.includes('https://kns.cnki.net/kns8s/AdvSearch')) {
            // 高级检索页面 - 添加定时检测
            
            // 添加批量操作按钮
            function addBatchButton() {
                const batchOpsBox = document.getElementById('batchOpsBox');
                if (batchOpsBox && !batchOpsBox.querySelector('li[id="batch_bibbtn_li"]')) {
                    // 创建新的li元素
                    const batchLi = document.createElement('li');
                    batchLi.id = 'batch_bibbtn_li';
                    batchLi.className = 'export';
                    
                    // 创建链接
                    const batchLink = document.createElement('a');
                    batchLink.href = 'javascript:void(0)';
                    batchLink.textContent = '批量复制BibTex';
                    batchLink.style.color = '#E3170D';
                    
                    // 为链接绑定点击事件
                    batchLink.addEventListener('click', () => {
                        const checkedBoxes = document.querySelectorAll('.cbItem:checked');
                        if (checkedBoxes.length === 0) {
                            alert('请先选择要复制的文献');
                            return;
                        }
                        const values = Array.from(checkedBoxes).map(cb => cb.value).join(',');
                        copyBibTex('batch_bibbtn_li', values);
                    });
                    
                    // 组装元素
                    batchLi.appendChild(batchLink);
                    batchOpsBox.appendChild(batchLi);
                }
            }
            
            // 定义检测和添加按钮的函数
            function checkAndAddButtons() {
                // 添加批量操作按钮
                addBatchButton();
                
                // 添加单个操作按钮
                const operatTds = document.getElementsByClassName('operat');
                
                Array.from(operatTds).forEach((operatTd, index) => {
                    // 检查该行是否已有按钮
                    if (operatTd.querySelector('button[id^="bibbtn_"]')) return;
                    
                    const button = createButton(true);  // 传入true表示是高级检索页面
                    button.id = `bibbtn_${index}`;
                    
                    const resultItem = operatTd.closest('tr');
                    if (resultItem) {
                        const cbItem = resultItem.querySelector('.cbItem');
                        if (cbItem) {
                            const filename_param = cbItem.value;
                            
                            // 将按钮添加到操作栏的开头
                            operatTd.insertBefore(button, operatTd.firstChild);
                            
                            // 为按钮绑定点击事件
                            $(`#bibbtn_${index}`).click(() => {
                                copyBibTex(`bibbtn_${index}`, filename_param);
                            });
                        }
                    }
                });
            }

            // 启动定时检测
            setInterval(checkAndAddButtons, 1000);
            
        } else {
            // 默认处理
            const otherButtons = document.getElementsByClassName('other-btns')[0];
            if (otherButtons) {
                const new_ul = document.createElement('ul');
                const button = createButton();
                new_ul.appendChild(button);
                otherButtons.appendChild(new_ul);
                
                // 绑定点击事件
                $("#bibbtn").click(() => copyBibTex());
            }
        }
    }

    // 启动脚本
    initialize();
})();
