// ==UserScript==
// @name         知网-文献-bibtex提取
// @description  从知网文献中直接复制bibtex
// @author       BN_Dou
// @version      3.0.0
// @namespace    https://github.com/BNDou/getCnkiLiteratureBibTex
// @match        https://greasyfork.org/zh-CN/users/883089-bndou
// @match        https://kns.cnki.net/kcms2/article/abstract?v=*
// @match        https://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @match        http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
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
    function createButton() {
        const button = document.createElement('button');
        button.id = "bibbtn";
        button.title = "点击复制BibTex";
        button.innerHTML = '<span>📋 BibTex</span>';
        button.style.cssText = STYLES.button;
        
        // 添加悬停效果
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
    async function getBibTex() {
        try {
            const params = {
                FileName: document.getElementById("paramdbname").getAttribute("value") + '!' + 
                         document.getElementById("paramfilename").getAttribute("value") + '!1!0',
                DisplayMode: 'BibTex',
                OrderParam: 0,
                OrderType: 'desc',
            };

            const response = await fetch('https://kns.cnki.net/dm/api/ShowExport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://kns.cnki.net/dm/manage/export.html',
                },
                body: new URLSearchParams(params),
            });

            const data = await response.text();
            bibtex = data.match(/<li>(.*?)<\/li>/s)[1].replace(/<br>/g, '');
        } catch (error) {
            console.error('获取BibTex失败:', error);
        }
    }

    // 复制BibTex到剪贴板
    function copyBibTex() {
        if (bibtex) {
            GM_setClipboard(bibtex);
            showCopySuccess(document.getElementById('bibbtn'));
        }
    }

    // 初始化
    function initialize() {
        injectStyles();
        
        // 添加菜单按钮
        GM_registerMenuCommand('📋 复制BibTex', copyBibTex);

        // 添加页面按钮
        const otherButtons = document.getElementsByClassName('other-btns')[0];
        const new_ul = document.createElement('ul');
        const button = createButton();
        
        new_ul.appendChild(button);
        otherButtons.appendChild(new_ul);

        // 获取BibTex数据
        getBibTex();

        // 绑定点击事件
        $("#bibbtn").click(copyBibTex);
    }

    // 启动脚本
    initialize();
})();
