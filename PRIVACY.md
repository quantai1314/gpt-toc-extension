# 拾纲 · ChatGPT 对话目录 隐私政策 / Shigang Privacy Policy

生效日期 / Effective date: 2026-10-04

本政策适用于 quantai1314/gpt-toc-extension 维护的社区版本，与 OpenAI 无隶属关系。
This policy applies to the community version maintained in quantai1314/gpt-toc-extension. It is not affiliated with OpenAI.

## 访问及用途 / Data access and use

扩展读取当前 ChatGPT 页面已加载的用户问题、回答文字及 H1–H6 标题，以生成目录、显示问题摘要和跳转到对应内容；同时读取页面主题标记来适配深浅色。这涉及聊天消息和网站内容，即使处理仅在本地进行。

The extension reads already-loaded user prompts, assistant response text, and H1–H6 headings on the current ChatGPT page to generate an outline, show question previews, and navigate to content. It also reads page theme markers to match light or dark mode. This handles chat messages and website content, even though processing is local.

## 保存与传输 / Retention and transfer

所有目录处理均在用户浏览器内完成。目录、导航目标、阅读位置和折叠状态仅保存在页面运行内存中，关闭或重新加载页面后不保留。扩展通过 Chrome 的本地扩展存储仅保存手动设置的目录宽度（一个数字），点击“自动宽度”可删除该偏好；不保存消息或目录。独立本地预览在自身的 localStorage 中保存同一宽度偏好。扩展不上传对话，不向开发者或第三方发送用户数据，不提供遥测、广告追踪或数据出售。开发者无法通过扩展读取用户聊天内容。

All processing takes place locally in the user's browser. Outline entries, navigation targets, reading position, and collapse state are held temporarily in page memory and are not retained after the page is closed or reloaded. Only the preferred sidebar width (one number) is saved in Chrome's local extension storage; choosing automatic width removes that preference. Messages and outlines are never persisted. The standalone local preview stores the same width preference in its own localStorage. The extension does not upload conversations, transmit user data to the developer or third parties, provide telemetry or advertising tracking, or sell user data. The developer cannot read users' conversations through the extension.

## 网站访问范围 / Website access

扩展仅在 https://chatgpt.com/* 和 https://chat.openai.com/* 注入目录脚本和样式，不访问其他网站，不读取 Cookie、账号凭据或后台聊天接口。所有执行代码随扩展安装包提供，不加载远程 JavaScript 或 Wasm。

The extension injects scripts and styles only on https://chatgpt.com/* and https://chat.openai.com/*. It does not access other websites, cookies, credentials, or background conversation APIs. All executable code is included in the extension package; no remote JavaScript or Wasm is loaded.

## 数据使用限制 / Limited Use

用户数据仅用于本扩展的目录与导航功能，不用于信用评估、放贷、广告或其他无关用途。本扩展对用户数据的使用符合 Chrome Web Store User Data Policy，包括 Limited Use 要求。

User data is used only for the extension's outline and navigation features, never for credit evaluation, lending, advertising, or unrelated purposes. The extension's use of user data complies with the Chrome Web Store User Data Policy, including the Limited Use requirements.

## 第三方与联系 / Third parties and contact

本政策仅涵盖扩展自身。ChatGPT、GitHub 及其他链接网站适用各自的隐私政策。政策变更会在本文件公布。

This policy covers the extension itself. ChatGPT, GitHub, and other linked websites have their own privacy policies. Policy changes will be published in this file.

联系 / Contact: [GitHub Issues](https://github.com/quantai1314/gpt-toc-extension/issues)。请勿在公开反馈中提供私人聊天内容 / Do not include private conversations in public reports.
