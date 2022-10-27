// ==UserScript==
// @name        知网_文献_bibtex提取
// @description 从知网文献中直接复制bibtex
// @namespace   getCnkiLiteratureBibtex
// @version     1.3.0
// @author      BN_Dou
// @license     AGPL License
// @match       https://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @match       http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=*
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require     https://cdn.jsdelivr.net/gh/zh-lx/pinyin-pro@latest/dist/pinyin-pro.js
// @grant       unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    var jQuery = unsafeWindow.jQuery;
    var { pinyin } = pinyinPro;

    jQuery(document).ready(function ($) {

        window.onload = function () {

            var a = document.getElementById("paramdbname")
            var b = document.getElementById("paramfilename")
            var fileid = a.getAttribute("value") + '!' + b.getAttribute("value") + '!1!0'

            //添加按钮
            var x = document.getElementsByClassName("btn-tool")
            var input = document.createElement('li')
            input.setAttribute("id", "bibbtn")
            input.setAttribute("class", "btn-note")
            input.setAttribute("title", "BibTex")
            input.innerHTML = ">>BibTex<<"
            input.style = "width: 72px;height: 23px;cursor: pointer;color: #e8e6e3;"
            x[0].children[0].append(input)

            //按下按钮
            $("#bibbtn").click(function () {
                $.post("https://kns.cnki.net/kns8/manage/APIGetExport",
                {
                    filename: fileid,
                    displaymode: "NoteExpress"
                },

                function (data) {
                    console.log(data);
                    var bibtext = ""
                    var ss = data.data[0].value[0]
                    var ssl = ss.split("<br>")
                    var label = ""
                    for (var j = 0; j < ssl.length - 1; j++) {
                        var kk = ssl[j].toLocaleLowerCase().split(" ").join("").split("}:")
                        if (kk[0] == "{author") {
                            label = kk[1].split(";")[0]
                        }
                    }
                    for (var i = 0; i < ssl.length - 1; i++) {
                        var k = ssl[i].toLocaleLowerCase().split(" ").join("").split("}:")
                        var item = k[0]
                        var detail = k[1]
                        if (item == "{referencetype") {
                            if (detail == "journalarticle") {
                                bibtext = "@article{" + pinyin(label, { toneType: 'none' }).split(" ").join("") + ",\n"
                            }
                            else if (detail == "conferenceproceedings") {
                                bibtext = "@inproceedings{" + pinyin(label, { toneType: 'none' }).split(" ").join("") + ",\n"
                            }
                            else if (detail == "patent") {
                                bibtext = "@patent{" + pinyin(label, { toneType: 'none' }).split(" ").join("") + ",\n"
                            }
                            else if (detail == "thesis") {
                                bibtext = "@thesis{" + pinyin(label, { toneType: 'none' }).split(" ").join("") + ",\n"
                            }
                        }
                        else if (item == "{issue") {
                            bibtext = bibtext + "  number={" + detail + "},\n"
                        }
                        else if (item == "{title") {
                            bibtext = bibtext + "   " + item.substr(1, item.length - 1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if (item == "{author") {
                            bibtext = bibtext + "   " + item.substr(1, item.length - 1) + "={" + detail.split(";").join(" and ").substr(0, detail.split(";").join(" and ").length - 5) + "},\n"
                        }
                        else if (item == "{authoraddress") {
                            bibtext = bibtext + "   " + item.substr(1, item.length - 1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if (item == "{journal") {
                            bibtext = bibtext + "   " + item.substr(1, item.length - 1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if (item == "{keywords") {
                            bibtext = bibtext + "   " + item.substr(1, item.length - 1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else if (item == "{abstract") {
                            bibtext = bibtext + "   " + item.substr(1, item.length - 1) + "={" + detail.toLocaleUpperCase() + "},\n"
                        }
                        else {
                            bibtext = bibtext + "   " + item.substr(1, item.length - 1) + "={" + detail + "},\n"
                        }
                    }
                    bibtext += "}"
                    //console.log(bibtext)
                    const copad = document.createElement('textarea')
                    copad.value = bibtext
                    document.body.appendChild(copad)
                    copad.select()
                    document.execCommand('Copy')
                    document.body.removeChild(copad)
                });
            })
        };
    })
})();