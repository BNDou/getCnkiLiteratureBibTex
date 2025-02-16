<!--
 * @Author: BNDou
 * @Date: 2022-10-28 00:21:23
 * @LastEditTime: 2025-02-16 17:55:25
 * @FilePath: \getCnkiLiteratureBibTex\README.md
 * @Description:
-->

# getCnkiLiteratureBibTex

从知网文献中直接复制引文，支持多种引文格式。

## 功能

- 用于从知网文献中一键复制引文，无需跳转页面等繁琐步骤
- 支持多种引文格式：
  - BibTeX（默认）
  - GB/T 7714-2015
  - 知网研学
  - CAJ-CD
  - MLA
  - APA
  - Refworks
  - EndNote
  - NoteExpress
  - NodeFirst
- 支持批量复制
- 支持通过油猴菜单快速切换引文格式

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [脚本猫](https://docs.scriptcat.org/) 浏览器扩展
2. 点击 [GreasyFork 直链安装](https://greasyfork.org/scripts/444428-知网-文献-bibtex提取/code/知网-文献-bibtex提取.user.js "前往安装") 或 [脚本猫 直链安装](https://scriptcat.org/zh-CN/script-show-page/2806 "前往安装")

## 使用方法

### 方法一：文献页
在知网文献页面，点击文献标题右侧的一个现代化的"BibTex"按钮（如下图）。点击即可复制文献的BibTex信息到剪贴板，并获得即时的复制成功反馈。

![复制按钮](https://cdn.bndou.eu.org/gh/BNDou/getCnkiLiteratureBibTex@main/img/CopyButton1.png "复制按钮")

### 方法二：高级检索页
在检索结果页面，可以单篇复制或批量复制，您会看到一个"批量复制BibTex"按钮和若干个"BibTex"按钮（如下图）。点击即可复制文献的BibTex信息到剪贴板，并获得即时的复制成功反馈。

![复制按钮](https://cdn.bndou.eu.org/gh/BNDou/getCnkiLiteratureBibTex@main/img/CopyButton2.png "复制按钮")

### 方法三：菜单栏
通过油猴或脚本猫等扩展的菜单可以切换不同的引文格式。

![菜单栏按钮](https://cdn.bndou.eu.org/gh/BNDou/getCnkiLiteratureBibTex@main/img/CitationType.png "菜单栏按钮")

## 功能特点

1. 现代化UI设计
   - 精心设计的按钮样式
   - 平滑的动画过渡效果
   - 清晰的视觉反馈
2. 交互体验
   - 一键复制功能
   - 复制成功动画提示
   - 悬停效果增强
3. 使用便捷
   - 支持菜单栏切换引文格式
   - 页面内按钮直接点击
   - 自动检测文献信息

## 更新日志

### v4.2.0
- 新增多种引文格式支持
- 添加引文格式切换功能
- 优化引文提取逻辑
- 改进代码结构

### v4.1.0
- 优化按钮样式
- 修复已知问题

### v4.0.0
- 新增高级检索页面支持
  - 为每个搜索结果添加复制按钮
  - 支持批量复制多篇文献的BibTeX
- 优化BibTeX数据处理
  - 改进数据提取算法
  - 优化换行和格式处理
  - 提升多文献批量处理的稳定性
- 改进用户体验
  - 添加复制前的选中检查
  - 优化按钮位置和样式
  - 保持与知网原有界面的一致性

### v3.0.0
- 全新现代化UI设计
- 添加复制成功动画效果
- 优化按钮交互体验
- 改进代码结构和性能

## 项目声明

- 这里的脚本只是自己学习 Javascript 的一个实践。
- 仅用于测试和学习研究，禁止用于商业用途，不能保证其合法性，准确性，完整性和有效性，请根据情况自行判断。
- 仓库内所有资源文件，禁止任何公众号、自媒体进行任何形式的转载、发布。
- 该项目的归属者对任何脚本问题概不负责，包括但不限于由任何脚本错误导致的任何损失或损害。
- 间接使用脚本的任何用户，包括但不限于建立 VPS 或在某些行为违反国家/地区法律或相关法规的情况下进行传播, 该项目的归属者对于由此引起的任何隐私泄漏或其他后果概不负责。
- 如果任何单位或个人认为该项目的脚本可能涉嫌侵犯其权利，则应及时通知并提供身份证明，所有权证明，我们将在收到认证文件后删除相关脚本。
- 任何以任何方式查看此项目的人或直接或间接使用该 Javascript 项目的任何脚本的使用者都应仔细阅读此声明。 该项目的归属者保留随时更改或补充此免责声明的权利。一旦使用并复制了任何相关脚本或 Javascript 项目的规则，则视为您已接受此免责声明。

---

[![Profile views](https://komarev.com/ghpvc/?username=BNDou&label=Profile+views "GitHub_BNDou")](https://github.com/BNDou)
