// ==UserScript==
// @name         知网-文献-bibtex提取
// @description  从知网文献中直接复制bibtex
// @author       BN_Dou
// @version      2.2.0
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

    var bibtex;

    //添加菜单按钮
    GM_registerMenuCommand('⭕BibTex复制', copyBibTex);

    //添加页面按钮
    var otherButtons = document.getElementsByClassName('other-btns')[0];
    var new_ul = document.createElement('ul');
    var button = document.createElement('button');
    button.id = "bibbtn";
    button.title = "BibTex"
    // 设置其他按钮的属性和样式
    button.innerHTML = "⭕BibTex";
    button.style = "width: 80px; height: 25px; border-radius: 8px; background-color: #4CAF50; border: none; color: white; font-size: 16px; font-weight: bold; text-align: center; cursor: pointer; float: right;";
    button.onmouseover = function () { this.style.backgroundColor = '#3e8e41'; };
    button.onmouseout = function () { this.style.backgroundColor = '#4CAF50'; };
    new_ul.appendChild(button);
    otherButtons.appendChild(new_ul);

    // 获取BibTex
    getBibTex();

    //按下页面按钮
    $("#bibbtn").click(copyBibTex);

    // 获取BibTex
    function getBibTex(){
        // 定义请求参数
        const params = {
            FileName: document.getElementById("paramdbname").getAttribute("value") + '!' + document.getElementById("paramfilename").getAttribute("value") + '!1!0',
            DisplayMode: 'BibTex',
            OrderParam: 0,
            OrderType: 'desc',
        };

        // 发送 POST 请求
        fetch('https://kns.cnki.net/dm/api/ShowExport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://kns.cnki.net/dm/manage/export.html',
            },
            body: new URLSearchParams(params),
        })
            .then(response => response.text())
            .then(data => {
            // 将响应内容存储到 bibtex 变量中
            bibtex = data.match(/<li>(.*?)<\/li>/s)[1].replace(/<br>/g, '');
        }).catch(error => console.error(error));
    }

    // 复制BibTex
    function copyBibTex() {
        if (bibtex) {
            console.log(bibtex);
            // 将内容复制到粘贴板
            GM_setClipboard(bibtex)
            //navigator.clipboard.writeText(bibtex);
        };
    }

})();
