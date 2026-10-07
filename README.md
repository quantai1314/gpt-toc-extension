# 拾纲 Shigang - ChatGPT Table of Contents

**简体中文** | [English](README.en.md)

为 ChatGPT 长对话添加一个可折叠的右侧目录。按回答整理标题，点击即可跳转，减少来回翻找。

<img src="icons/shigang-128.png" alt="拾纲图标" width="80" height="80">

**拾纲 Shigang** 是本维护版本的独立名称。图标采用深青色、浅色目录线条与琥珀色书签；保留原项目的 MIT 版权署名。

本仓库由 [quantai1314](https://github.com/quantai1314) 维护，基于 [WindZZzzZZzz/gpt-toc-extension](https://github.com/WindZZzzZZzz/gpt-toc-extension) 修改，主要包含 **新版 ChatGPT 页面兼容修复**和**侧栏 UI 重设计**。兼容性修复已单独提交至原项目 [PR #20](https://github.com/WindZZzzZZzz/gpt-toc-extension/pull/20)，新版 UI 在本仓库维护。

[Chrome 商店安装](https://chromewebstore.google.com/detail/shigang-chatgpt-table-of/gnkgnojbcclcfjelkijmhaaboidhnehk) · [Edge 商店安装](https://microsoftedge.microsoft.com/addons/detail/kojdleblcoelmniokkifjjfhmjeaddfj) · [v1.0.3 Release](https://github.com/quantai1314/gpt-toc-extension/releases/tag/v1.0.3) · [反馈问题](https://github.com/quantai1314/gpt-toc-extension/issues) · [修改记录](CHANGELOG.md)

## 功能

- **按回答生成目录**：提取回答中的 H1–H6 标题，并关联前面的用户问题。
- **保留渲染格式**：标题与问题摘要中的加粗、斜体、行内代码、上下标按页面已有格式显示。
- **数学公式**：提取 KaTeX 的 MathML，保留分数、根式、上下标和矩阵，避免公式、LaTeX 源码与隐藏文字重复；超长公式可横向滚动。
- **点击定位**：平滑滚动到对应标题，不增加目录或正文高亮。
- **正文避让**：根据正文右侧空间限制宽度；空间不足时自动收起，空间恢复后恢复之前的展开状态。
- **宽度调节**：拖动目录左边缘调整宽度，记住本机偏好；底部“自动宽度”可恢复默认。支持聚焦边缘后用左右方向键调节，Home 恢复自动宽度。
- **阅读跟随**：正文上下滚动时，目录列表在必要时滚动到对应章节；手动翻阅目录时暂停跟随，正文再次滚动后恢复，不自动展开已折叠的章节。
- **分层折叠**：可以折叠整段回答，也可以折叠某个标题下的子章节。
- **动态更新**：回答生成、标题修改或删除时更新目录；切换会话时读取当前显示的正文，排除网页缓存的隐藏旧对话，并清理旧目录状态，无需刷新。
- **紧凑侧栏**：圆角悬浮面板、两行问题摘要，以及回答和标题数量统计。
- **深浅色适配**：优先识别页面主题标记，没有明确标记时跟随系统偏好。
- **键盘操作**：聚焦目录标题后，可以按 Enter 或空格跳转。
- **中英文界面**：按浏览器语言显示中文或英文名称、按钮和摘要；英文品牌为 Shigang。

## 安装

推荐从商店安装 **拾纲 Shigang**，无需开发者模式，后续更新由浏览器管理：

- [Chrome Web Store](https://chromewebstore.google.com/detail/shigang-chatgpt-table-of/gnkgnojbcclcfjelkijmhaaboidhnehk)
- [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/kojdleblcoelmniokkifjjfhmjeaddfj)

安装后刷新 [ChatGPT](https://chatgpt.com/)，点击右上方的「目录」。下面是手动加载源码的替代方式：

1. [下载 ZIP](https://github.com/quantai1314/gpt-toc-extension/archive/refs/heads/main.zip)，解压到一个准备长期保留的目录。
2. 打开 Chrome 的 `chrome://extensions/`，或 Edge 的 `edge://extensions/`。
3. 打开右上角的「开发者模式」。
4. 点击「加载已解压的扩展程序」，选择**直接包含 `manifest.json` 的文件夹**。
5. 打开或刷新 [ChatGPT](https://chatgpt.com/)，点击页面右上方的「目录」。

不需要安装 Node.js、运行构建或执行 `npm install`。Node.js 仅用于开发时重新生成独立预览文件。

> 加载后请保留该文件夹，不要移动或改名。Chrome 会继续从这个位置读取扩展。安装了旧版时，建议先停用旧版，避免同时出现两个目录面板。

## 使用与更新

点击目录标题可以定位正文；点击右侧小箭头可以折叠或展开。点击问题摘要会定位对应问题；点击右上角「×」关闭侧栏，再点「目录」可重新打开。

商店安装版由浏览器管理更新；更新后刷新 ChatGPT 页面即可。手动加载版更新文件后，需要在 `chrome://extensions/` 或 `edge://extensions/` 中重新加载 **拾纲 Shigang - ChatGPT 对话目录**，再刷新 ChatGPT 页面。仅刷新网页不会重新加载本地扩展文件。

如果更换了扩展文件夹的位置，请重新使用「加载已解压的扩展程序」选择新位置。

## 实际截图

以下为公开知识示例对话的实际使用截图，已裁掉账号头像和左侧导航。

![Shigang light mode / 拾纲浅色模式](assets/screenshots/shigang-light-1920x1080.png)

![Shigang dark mode / 拾纲深色模式](assets/screenshots/shigang-dark-1920x1080.png)

## 不安装也能预览

下载并解压仓库后，双击 [ui-preview.html](ui-preview.html)，即可查看新版界面。

该文件内置样式、脚本和示例对话，无需服务器、ChatGPT 登录或扩展安装。可以切换浅色／深色，体验跳转、宽度调节、阅读跟随和折叠。GitHub 的文件页展示的是源码，需要下载后在浏览器中打开。

预览页模拟对话背景；实际扩展只添加目录面板和入口按钮，不会把 ChatGPT 整个页面改成预览页的布局。

## 常见问题

### 页面有回答，但提示「No responses found」

先确认加载的是本仓库的修改版，再重新加载扩展并刷新 ChatGPT。原版只查找 `data-message-author-role="assistant"`，无法识别此次遇到的新版页面结构；本版同时支持 `data-markdown-text-style="assistant-message"`。

### 提示「No headings in this response」

这段回答没有 H1–H6 标题。普通段落或单纯加粗的文字不会自动变成目录标题。

### 数学公式会怎样显示？

在此次检查的 ChatGPT 页面中，数学公式使用 LaTeX 语法，由 KaTeX 渲染。目录提取已经生成的 MathML，并由浏览器显示；不再将公式结构、TeX 源码和视觉 HTML 拼接为普通文字。

本版支持页面已有的 KaTeX、原生 MathML，以及带辅助 MathML 的 MathJax 结构，不额外下载数学库。仅显示标题或问题摘要中的公式，不会把回答内的每条独立公式都添加到目录。代码块中的 LaTeX 或尚未被页面渲染的原文不作为公式重新解析；如果网页稍后生成公式结构，目录会随之更新。

### 「无法加载清单」或「File path cannot be resolved」

检查 Chrome 指向的文件夹是否还存在，以及所选文件夹中是否直接包含 `manifest.json`。不要选择 ZIP 文件、上一级目录、`icons` 或 `tests` 子目录。

### 长对话里有些内容没出现在目录中

目录只整理当前页面 DOM 中已加载的回答。ChatGPT 可能按需加载或卸载历史消息，本扩展不会请求后台接口来下载整段聊天记录。

### 深浅色在哪里切换？

实际扩展自动适配页面主题或系统偏好；独立预览页顶部的切换按钮只用于展示两种效果。

### 为什么目录自动收起来了？

正文右侧空间不足以容纳至少 220px 宽的目录时，会收起为顶部的小目录按钮，避免覆盖正文。扩大窗口、降低浏览器缩放或收起 ChatGPT 左侧栏可以腾出空间。若原来已展开，空间恢复后会自动展开；主动关闭的目录不会自行展开。

### 怎样调整宽度或恢复默认？

鼠标放到目录左边缘，出现左右调整光标后拖动即可。向左拖变宽，向右拖变窄。偏好宽度会保存在本机，但实际宽度始终受正文右侧空间限制。点击底部“自动宽度”清除偏好，恢复默认 300px（空间不足时缩小）。

## 本地开发与检查

| 文件 | 用途 |
| --- | --- |
| `content.js` | 回答识别、目录生成、动态更新和交互 |
| `styles.css` | 侧栏与入口按钮样式 |
| `manifest.json` | Chrome 扩展配置 |
| `preview.html` | 引用当前源码的预览模板 |
| `build-preview.cjs` | 将模板、样式和脚本打包为单个 HTML |
| `build-brand.py`、`icons/shigang.svg` | 可编辑的品牌图标与 PNG 生成脚本（Pillow） |
| `ui-preview.html` | 可直接打开的独立预览文件 |
| `tests/regression.html`、`tests/regression.js` | 浏览器回归检查 |
| `test.html` | 旧版消息结构的手动示例页 |
| `landing_page/` | 项目介绍页源码 |

修改源码后，重新生成独立预览：

```sh
npm run build:preview
```

JavaScript 语法检查：

```sh
node --check content.js
node --check tests/regression.js
node --check build-preview.cjs
```

运行浏览器回归检查：

```sh
python -m http.server 8765 --bind 127.0.0.1
```

随后打开 `http://127.0.0.1:8765/tests/regression.html`。页面会显示逐项结果，全部通过时显示 **36 tests passed**。建议窗口宽度至少 1100px，以便同时显示测试正文和目录。`npm test` 仅显示运行指引，不会自动执行这些浏览器检查。

2026-10-04 本地源码通过 36 项 Chromium 浏览器回归检查，覆盖宽度调节、正文避让、阅读跟随及隐藏旧工作区的对话切换：地址先切换而正文稍后切换、仅改变工作区可见性、空对话异步加载和宽度偏好保留；另验证英文标签、中文回退及数量占位符。这次回归记录不包含 Edge 浏览器安装实测。商店上架状态见下方发布记录。

2026-10-03 在 Chrome 中通过 20 项检查，覆盖新旧消息结构、去重、问题关联、流式更新、空状态、导航目标替换、文字转义、观察器循环，以及 Markdown 格式、公式去重、分数与上下标、矩阵、异步公式更新、长公式布局和安全属性过滤。独立预览的深浅色公式显示已检查。此次也读取了实际 ChatGPT 页面的 KaTeX DOM，确认旧目录出现重复公式文字的原因；新源码仍需重新加载扩展后在实际页面验收。以上不代表对未来 ChatGPT 页面变更的保证。

## Chrome 与 Edge 商店发布

截至 2026-10-07，**1.0.3「拾纲 Shigang」** 已在两家商店公开上架，公开商品页面已核对：

- [Chrome Web Store](https://chromewebstore.google.com/detail/shigang-chatgpt-table-of/gnkgnojbcclcfjelkijmhaaboidhnehk)：页面显示版本 1.0.3。
- [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/kojdleblcoelmniokkifjjfhmjeaddfj)：公开商品页可访问。
- [GitHub Release v1.0.3](https://github.com/quantai1314/gpt-toc-extension/releases/tag/v1.0.3)：发布说明含两家商店链接，附同一份商店提交 ZIP。

2026-10-07 已将商店演示预览截图替换为真实浅色／深色示例截图并提交资料更新：Chrome 待审核，Edge In review；新图片通过审核后才会出现在商店，现有 1.0.3 仍已上架。GitHub 已同步真实截图。

GitHub 源码已同步双语名称与界面、新图标及当前功能。两家提交的是同一安装包 `shigang-chatgpt-outline-1.0.3.zip`，SHA-256：`2dd46e628b566efe31a08213ea3bfa815041c3a2a38274389d3a6732ad325f99`。发布资料见 [CHROMEWEBSTORE.md](CHROMEWEBSTORE.md)、[EDGEADDONS.md](EDGEADDONS.md)，中英文文案源为 [store-listings.json](store-listings.json)。

## 数据处理

目录代码在浏览器内读取已加载的消息文字和标题，不上传对话、不提供遥测。`storage` 权限仅用于在本机保存手动设置的目录宽度，不保存消息、目录、阅读位置或折叠状态。独立本地预览使用自身的 localStorage 保存同一宽度偏好。扩展匹配 `chatgpt.com` 与旧域名 `chat.openai.com`。这些说明针对扩展代码，不代表 ChatGPT、GitHub 或介绍页所用第三方资源的数据处理方式。

## 来源与许可

感谢原作者及原项目贡献者。本项目保留原项目的 [MIT License](LICENSE) 和版权声明。

遇到问题请在[本仓库 Issues](https://github.com/quantai1314/gpt-toc-extension/issues) 中说明浏览器版本、复现步骤和错误文字。提供截图时建议新建仅含公开知识的示例对话，截取相关正文和目录，避开账号信息、左侧历史记录及分享链接；不需要提供私人聊天。
