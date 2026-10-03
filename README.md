# ChatGPT 对话目录

为 ChatGPT 长对话添加一个可折叠的右侧目录。按回答整理标题，点击即可跳转，减少来回翻找。

本仓库由 [quantai1314](https://github.com/quantai1314) 维护，基于 [WindZZzzZZzz/gpt-toc-extension](https://github.com/WindZZzzZZzz/gpt-toc-extension) 修改，主要包含 **新版 ChatGPT 页面兼容修复**和**侧栏 UI 重设计**。兼容性修复已单独提交至原项目 [PR #20](https://github.com/WindZZzzZZzz/gpt-toc-extension/pull/20)，新版 UI 在本仓库维护。

[下载 ZIP](https://github.com/quantai1314/gpt-toc-extension/archive/refs/heads/main.zip) · [反馈问题](https://github.com/quantai1314/gpt-toc-extension/issues) · [修改记录](CHANGELOG.md)

## 功能

- **按回答生成目录**：提取回答中的 H1–H6 标题，并关联前面的用户问题。
- **点击定位**：平滑滚动到对应标题，短暂高亮正文；目录标记最近点击的标题。
- **分层折叠**：可以折叠整段回答，也可以折叠某个标题下的子章节。
- **动态更新**：回答生成、标题修改或删除时更新目录，切换会话时清理旧状态。
- **紧凑侧栏**：圆角悬浮面板、两行问题摘要，以及回答和标题数量统计。
- **深浅色适配**：优先识别页面主题标记，没有明确标记时跟随系统偏好。
- **键盘操作**：聚焦目录标题后，可以按 Enter 或空格跳转。

## 安装

当前修改版通过本仓库分发。原项目的 Chrome 商店版本不等于本仓库版本。

1. [下载 ZIP](https://github.com/quantai1314/gpt-toc-extension/archive/refs/heads/main.zip)，解压到一个准备长期保留的目录。
2. 打开 Chrome，进入 `chrome://extensions/`。
3. 打开右上角的「开发者模式」。
4. 点击「加载已解压的扩展程序」，选择**直接包含 `manifest.json` 的文件夹**。
5. 打开或刷新 [ChatGPT](https://chatgpt.com/)，点击页面右上方的「目录」。

不需要安装 Node.js、运行构建或执行 `npm install`。Node.js 仅用于开发时重新生成独立预览文件。

> 加载后请保留该文件夹，不要移动或改名。Chrome 会继续从这个位置读取扩展。安装了旧版时，建议先停用旧版，避免同时出现两个目录面板。

## 使用与更新

点击目录标题可以定位正文；点击右侧小箭头可以折叠或展开。点击问题摘要会定位对应问题；点击右上角「×」关闭侧栏，再点「目录」可重新打开。

更新文件后，需要在 `chrome://extensions/` 中重新加载 **ChatGPT Table of Contents**，再刷新 ChatGPT 页面。仅刷新网页不会让 Chrome 重新加载扩展文件。

如果更换了扩展文件夹的位置，请重新使用「加载已解压的扩展程序」选择新位置。

## 不安装也能预览

下载并解压仓库后，双击 [ui-preview.html](ui-preview.html)，即可查看新版界面。

该文件内置样式、脚本和示例对话，无需服务器、ChatGPT 登录或扩展安装。可以切换浅色／深色，体验跳转、高亮和折叠。GitHub 的文件页展示的是源码，需要下载后在浏览器中打开。

预览页模拟对话背景；实际扩展只添加目录面板和入口按钮，不会把 ChatGPT 整个页面改成预览页的布局。

## 常见问题

### 页面有回答，但提示「No responses found」

先确认加载的是本仓库的修改版，再重新加载扩展并刷新 ChatGPT。原版只查找 `data-message-author-role="assistant"`，无法识别此次遇到的新版页面结构；本版同时支持 `data-markdown-text-style="assistant-message"`。

### 提示「No headings in this response」

这段回答没有 H1–H6 标题。普通段落或单纯加粗的文字不会自动变成目录标题。

### 「无法加载清单」或「File path cannot be resolved」

检查 Chrome 指向的文件夹是否还存在，以及所选文件夹中是否直接包含 `manifest.json`。不要选择 ZIP 文件、上一级目录、`icons` 或 `tests` 子目录。

### 长对话里有些内容没出现在目录中

目录只整理当前页面 DOM 中已加载的回答。ChatGPT 可能按需加载或卸载历史消息，本扩展不会请求后台接口来下载整段聊天记录。

### 深浅色在哪里切换？

实际扩展自动适配页面主题或系统偏好；独立预览页顶部的切换按钮只用于展示两种效果。

## 本地开发与检查

| 文件 | 用途 |
| --- | --- |
| `content.js` | 回答识别、目录生成、动态更新和交互 |
| `styles.css` | 侧栏与入口按钮样式 |
| `manifest.json` | Chrome 扩展配置 |
| `preview.html` | 引用当前源码的预览模板 |
| `build-preview.cjs` | 将模板、样式和脚本打包为单个 HTML |
| `ui-preview.html` | 可直接打开的独立预览文件 |
| `tests/regression.html`、`tests/regression.js` | 浏览器回归检查 |
| `test.html` | 旧版消息结构的手动示例页 |
| `landing_page/` | 项目介绍页源码 |

修改源码后，重新生成独立预览：

```sh
node build-preview.cjs
# 或 npm run build:preview
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

随后打开 `http://127.0.0.1:8765/tests/regression.html`。页面会显示逐项结果，全部通过时显示 **15 tests passed**。`npm test` 仅显示运行指引，不会自动执行这些浏览器检查。

此前已在 Chrome 中通过 15 项检查，覆盖新旧消息结构、去重、问题关联、流式更新、空状态、导航目标替换、文字转义和观察器循环。兼容修复也曾在实际 ChatGPT 会话中验证：识别到 3 组回答、25 个标题，跳转和折叠正常。以上是当时验证结果，不代表对未来 ChatGPT 页面变更的保证。

## 数据处理

目录代码在浏览器内读取已加载的消息文字和标题，没有实现对话上传、遥测或持久化存储。扩展匹配 `chatgpt.com` 与旧域名 `chat.openai.com`。这些说明针对扩展代码，不代表 ChatGPT、GitHub 或介绍页所用第三方资源的数据处理方式。

## 来源与许可

感谢原作者及原项目贡献者。本项目保留原项目的 [MIT License](LICENSE) 和版权声明。

遇到问题请在[本仓库 Issues](https://github.com/quantai1314/gpt-toc-extension/issues) 中说明浏览器版本、复现步骤和错误文字。提供截图时请遮住不希望公开的聊天内容。
