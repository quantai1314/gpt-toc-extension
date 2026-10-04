# Chrome Web Store 发布材料

最近提交日期：2026-10-04（Asia/Shanghai）。对象为本仓库修改版，不是原作者已发布的商店条目。用户撤销 1.0.1 审核后，1.0.2 已成功重新提交，后台状态为“待审核”，尚未上架。

扩展 ID：gnkgnojbcclcfjelkijmhaaboidhnehk。
后台：https://chrome.google.com/webstore/devconsole/ab8937fa-58a0-4ae1-b02b-cdbcaedfab48/gnkgnojbcclcfjelkijmhaaboidhnehk/edit/listing
审核状态页：https://chrome.google.com/webstore/devconsole/ab8937fa-58a0-4ae1-b02b-cdbcaedfab48/gnkgnojbcclcfjelkijmhaaboidhnehk/edit/status
公开联系邮箱 quantai520@outlook.com 已验证。提交时保留“通过审核后自动发布”选项。无剩余提交阻塞，等待商店审核结果。
最新提交凭据：dist/store-assets/review-submitted-1.0.2.jpg。此前 1.0.1 凭据保留在 dist/store-assets/review-submitted.jpg。

此前提交的 1.0.2 包含提交时源码的 Markdown 行内格式与 MathML 公式修复，20 项浏览器回归检查全部通过。ZIP SHA256：8653f5d47648afb91d562268bf858eb28b8caedda77a67b48d6dbdaf123c9dd0。后续新增的正文避让、宽度调节、无高亮阅读跟随和对话切换修复已同步 GitHub 源码与预览，尚未重新提交商店；下列商品文案和审核记录对应此前的提交包。

## 基本信息

- 名称：ChatGPT Table of Contents
- 版本：1.0.2（以 manifest.json 为准）
- 主语言：简体中文
- 分类：工具
- 分发：免费，公开，所有地区（已核对后台）
- 支持链接：https://github.com/quantai1314/gpt-toc-extension/issues
- 官网：可使用上述仓库；不要直接使用原项目的 chatgpttoc.com 域名，除非确认拥有控制权。
- 隐私政策：https://github.com/quantai1314/gpt-toc-extension/blob/main/PRIVACY.md （已发布、核对匿名访问，并填写后台）。本地有 PRIVACY.md 和 landing_page/privacy.html。
- 安装包：dist/chatgpt-toc-1.0.2.zip

## 简短说明

为 ChatGPT 长对话生成可折叠目录，支持标题跳转、动态更新与深浅色侧栏。

## 详细说明

为 ChatGPT 长对话添加可折叠的右侧目录。按回答整理标题，点击即可回到对应内容，减少来回翻找。

主要功能：
- 提取回答中的 H1–H6 标题，按回答分组并显示问题摘要。
- 保留标题和问题摘要中已渲染的 Markdown 行内格式与数学公式，超长公式可横向滚动。
- 点击标题平滑跳转，并短暂高亮正文。
- 折叠整段回答，或折叠标题下的子章节。
- 回答生成、标题变化以及会话切换时更新目录。
- 适配深色和浅色主题，支持使用 Enter 或空格定位目录标题。

使用方式：安装后刷新 ChatGPT 页面，点击页面右上方的“目录”。

扩展仅整理当前页面中已加载的消息，不下载完整聊天记录。没有 H1–H6 标题的回答不会生成章节目录。ChatGPT 页面变化可能影响兼容性。

所有目录处理均在浏览器本地完成。扩展不上传对话，不提供遥测，也不持久化保存消息或目录。

本扩展由社区维护，与 OpenAI 无隶属或背书关系。基于 WindZZzzZZzz/gpt-toc-extension 的 MIT 开源项目修改，保留原作者版权与许可。

## 单一用途

在 ChatGPT 对话页面生成可折叠的标题目录，并帮助用户定位当前已加载的回答内容。

## 权限理由

GitHub 新源码使用 `storage` 权限，仅在本机保存目录宽度偏好（一个数字）；不保存聊天内容、目录或阅读位置。此前已提交的 1.0.2 ZIP 的 permissions 仍为空。新增功能尚未重新打包或提交商店，后续提交时需同步商品说明、权限理由与隐私声明。

https://chatgpt.com/* 与 https://chat.openai.com/*：需要在这两个 ChatGPT 域名注入目录脚本和样式，读取当前已加载的用户问题、回答及 H1–H6 标题，在页面中生成目录并滚动到选定位置。后者用于旧域名兼容。扩展不访问其他网站，不读取 Cookie、账号凭据或后台聊天接口。

## 数据与远程代码声明

- 访问的数据：当前 ChatGPT 页面中已加载的消息文字、标题和页面主题标记；只用于本地目录、问题摘要、跳转和主题适配。
- 临时状态：目录、折叠状态、阅读位置和导航目标仅保存在页面运行内存中。新本地源码仅额外保存目录宽度数字，点击“自动宽度”可清除。
- 传输、出售、广告、遥测：均未实现。
- 远程代码：无；脚本和样式随安装包提供，不加载远程 JavaScript 或执行下载代码。
- 后台数据披露：已勾选“个人通讯”和“网站内容”。官方 FAQ 明确要求本地处理也披露。当前实现没有开发者或第三方接收用户数据。
- 后台用途认证：阅读后台显示的政策后按实际实现确认，不替发布者接受尚未阅读的法律协议。

## 审核测试说明

1. 使用审核人员自己的 ChatGPT 账号打开 https://chatgpt.com/；本扩展没有独立账号或付费功能。
2. 在会话中要求 ChatGPT 输出带 Markdown 标题（如 ## 概述、### 步骤）的回答。
3. 点击右上角“目录”，检查回答分组、问题摘要、标题层级。
4. 点击目录标题检查跳转；点击小箭头检查折叠；继续生成带标题的回答检查更新。
5. 切换会话检查旧条目清理；切换 ChatGPT 深浅色主题检查侧栏适配。
6. 在标题或问题中加入加粗、行内代码和已渲染的分数公式，检查格式保留、公式不重复及长公式横向滚动。

## 商店素材与待完成项

此前提交包验证：content.js 与 tests/regression.js 的 Node.js 语法检查通过；在内置 Chromium 浏览器执行当时的回归页，显示 20 tests passed。ZIP 文件完整性、manifest 版本及所有打包文件与提交时源码逐项一致性检查通过。这些检查不等于实际 ChatGPT 安装测试或商店审核通过。

- 图标：icons/toc_gpt_icon_128.png。
- 已上传两张 1280×800 JPEG 功能截图：dist/store-assets/screenshot-light-1280x800.jpg 和 screenshot-dark-1280x800.jpg。截图运行实际目录代码，使用示例对话，明确标注“非 ChatGPT 原站截图”；审核说明也披露这一点。
- 440×280 宣传图：dist/store-assets/promo-440x280.png。
- 发布者已登录；公开联系邮箱 quantai520@outlook.com 已验证。
- 已通过 GitHub 连接器新增 PRIVACY.md（提交 d6f1527063666e6babdbdc0026d4d645dabc2f7c）及同步 landing_page/privacy.html（提交 026d586eed78447b241945caae11038071cfb85d）。此前运行代码修复已同步到远程 main（提交 78f9644bf338bacf74f9593fdfbd5420166e7a86）。当前目录已关联远程仓库；本次同步包含新增功能、对话切换修复、预览、回归检查及隐私说明。
- 未执行实际 ChatGPT 扩展安装测试；现有回归检查已通过。商店是否接受演示截图，以审核结果为准。
- 商品说明、图标、宣传图、两张截图、权限与隐私声明、审核测试说明均已填写并保存，已完成审核提交。后台显示“该草稿尚待审核”。

## 官方依据

- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/webstore/images
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
