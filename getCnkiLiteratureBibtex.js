// ==UserScript==
// @name         知网-文献-bibtex提取
// @description  从知网文献中直接复制bibtex
// @author       BN_Dou
// @version      2.1.0
// @namespace    https://github.com/BNDou/getCnkiLiteratureBibTex
// @match        https://greasyfork.org/zh-CN/users/883089-bndou
// @match        https://kns.cnki.net/kcms2/article/abstract?v=*
// @match        https://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @match        http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.cnki.net/favicon.ico
// @grant        none
// @license      AGPL License
// @downloadURL  https://update.greasyfork.org/scripts/444428/%E7%9F%A5%E7%BD%91-%E6%96%87%E7%8C%AE-bibtex%E6%8F%90%E5%8F%96.user.js
// @updateURL    https://update.greasyfork.org/scripts/444428/%E7%9F%A5%E7%BD%91-%E6%96%87%E7%8C%AE-bibtex%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //添加按钮
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

    var bibtex;
    var fileid = document.getElementById("paramdbname").getAttribute("value") + '!' + document.getElementById("paramfilename").getAttribute("value") + '!1!0';
    //按下按钮
    $("#bibbtn").click(function () {
        // 定义请求参数
        const params = {
            FileName: fileid,
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

        if (bibtex) {
            console.log(bibtex);
            // 将内容复制到粘贴板
            navigator.clipboard.writeText(bibtex);
        };
    });
})();
