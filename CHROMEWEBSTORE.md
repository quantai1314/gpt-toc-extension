# Chrome Web Store 发布材料

截至 2026-10-07（Asia/Shanghai），**拾纲 Shigang 1.0.3 已公开上架**。公开商品页已核对，显示版本 1.0.3、更新时间 2026-10-06。此前于 2026-10-04 提交审核。

- 公开安装：[Chrome Web Store](https://chromewebstore.google.com/detail/shigang-chatgpt-table-of/gnkgnojbcclcfjelkijmhaaboidhnehk)。
- GitHub 发行：[v1.0.3](https://github.com/quantai1314/gpt-toc-extension/releases/tag/v1.0.3)。

- 扩展 ID：gnkgnojbcclcfjelkijmhaaboidhnehk。
- 后台：https://chrome.google.com/webstore/devconsole/ab8937fa-58a0-4ae1-b02b-cdbcaedfab48/gnkgnojbcclcfjelkijmhaaboidhnehk/edit/status
- 已验证公开联系邮箱：quantai520@outlook.com。
- 提交凭据：dist/store-assets/review-submitted-1.0.3.jpg。
- 包：dist/shigang-chatgpt-outline-1.0.3.zip。
- SHA256：2dd46e628b566efe31a08213ea3bfa815041c3a2a38274389d3a6732ad325f99。

## 商品与国际化

- 英文名称：Shigang - ChatGPT Table of Contents。
- 中文名称：拾纲 Shigang - ChatGPT 对话目录。
- 版本：manifest.json 与 package.json 均为 1.0.3。
- 默认语言：en；另支持 zh_CN。后台已识别两种语言，并分别保存商品说明。
- 分类：工具；免费、公开、全部可选地区。
- 支持：https://github.com/quantai1314/gpt-toc-extension/issues。
- 首页：https://github.com/quantai1314/gpt-toc-extension。
- 隐私政策：https://github.com/quantai1314/gpt-toc-extension/blob/main/PRIVACY.md。
- 中英文说明源：store-listings.json。英文名称和摘要直接由 _locales/en/messages.json 读取，中文来自 _locales/zh_CN/messages.json。
- 国际化已覆盖侧栏、入口按钮、提示、空状态和数量占位符。搜索排名和索引时间由商店决定，不保证某个关键词的位置。

## 图片

- 新图标：icons/shigang-128.png。可编辑源为 icons/shigang.svg，其余尺寸由 build-brand.py 生成。
- 全球英文宣传图：dist/store-assets/shigang-promo-en-440x280.png，PNG RGB。
- 全球英文截图：shigang-en-light-1280x800.jpg、shigang-en-dark-1280x800.jpg。
- 中文本地化截图：shigang-zh-light-1280x800.jpg、shigang-zh-dark-1280x800.jpg。
- 截图运行真实目录代码和示例内容，明确标注演示预览，非 ChatGPT 原站截图；审核说明也披露此点。
- 已按用户确认移除后台旧图标、旧宣传图、两张旧截图，上传新素材。旧素材本地保留。

## 权限和隐私

单一用途：为当前已加载的 ChatGPT 对话生成可折叠标题目录，帮助用户定位回答内容。

- storage：只在本机扩展存储保存一个侧栏宽度数字；“自动宽度”清除此偏好。不保存对话、目录、阅读位置和折叠状态。
- https://chatgpt.com/* 与 https://chat.openai.com/*：运行随包提供的目录脚本与样式，读取已加载的问题和回答标题，构建目录并定位正文；不访问 Cookie、凭据、其他网站或后台聊天接口。
- 无远程代码、遥测、对话上传、广告追踪或出售数据。
- 数据披露：勾选“个人通讯”“网站内容”，如实披露本地处理，三项实际用途声明已确认。
- 提交时已核对公开隐私政策包含宽度偏好保存说明。2026-10-07 已同步品牌与国际化源码至 GitHub。

## 审核测试说明

Chrome 后台已保存以下英文说明（490/500 字符）：

No extension account/payment needed. Use your own ChatGPT account at https://chatgpt.com/. Request H2/H3 headings; open Outline (Chinese: 目录). Check prompt grouping, heading jumps, folding, streaming updates, chat switching, dark/light themes, formatted math and long-formula scrolling. Scroll to test reading follow; drag sidebar edge to resize; Auto width clears saved width. Only loaded messages are indexed. Screenshots run actual code with sample content and are labeled demo previews.

## 验证与历史

本地 36 项 Chromium 浏览器回归检查、JS 语法、git diff --check、ZIP 完整性、版本、图标尺寸及打包文件与源码一致性检查通过。已检查中英文和深浅色预览。未新增实际 ChatGPT 扩展安装测试，不将这些检查视为商店审核通过。

此前 1.0.1、1.0.2 包和提交截图保留为历史资料。1.0.2 提交包 SHA256 为 8653f5d47648afb91d562268bf858eb28b8caedda77a67b48d6dbdaf123c9dd0，主要包含 Markdown/MathML 修复。本次取消其审核，替换为包含宽度调节、正文避让、阅读跟随、缓存会话切换修复和品牌国际化的 1.0.3 后重新提交。当前有效审核记录以本页开头为准。

Edge 使用同一份 1.0.3 ZIP，现已公开上架；详情见 EDGEADDONS.md。

## 官方依据

- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/webstore/cws-dashboard-listing
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- https://developer.chrome.com/docs/extensions/reference/api/i18n
