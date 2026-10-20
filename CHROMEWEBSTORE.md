# Chrome Web Store 发布材料

截至 2026-10-20（Asia/Shanghai），**拾纲 Shigang 1.0.3 仍公开上架**。英文公开商品页显示版本 1.0.3、更新时间 2026-10-08；2026-10-07 提交的真实浅色、深色截图均已在公开画廊展示。两张下载 PNG 与仓库 1280×800 提交版逐字节一致，且与 README 的 1920×1080 版本为相同场景、不同裁剪。

此前于 2026-10-04 提交版本审核；2026-10-07 提交截图资料更新时记录为待审核，并保留通过审核自动发布。该状态仅为历史记录；本次未访问开发者后台，最新正式审核状态、确切批准和生效日期未核实。不能将公开展示或 2026-10-08 的商品页更新时间等同于后台审核结论。验证仅覆盖本次英文公开商品页及其图片资源，不推定全部语言、地区或缓存已同步。

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
- 本次全球截图与中文本地化截图：assets/screenshots/shigang-light-1280x800.png、shigang-dark-1280x800.png。
- 两张均为用户提供的真实 ChatGPT 示例对话截图，只裁剪和等比缩放；裁掉账号头像及左侧导航，保留正文和完整目录。正文与目录标签为中文示例。
- 商店使用 1280×800、24 位 RGB PNG；GitHub 另使用 1920×1080 的 16:9 版本。
- 2026-10-04 的演示预览截图及原品牌素材保留在本地 dist/store-assets，作为历史资料。图标和宣传图没有在本次更换。
- 2026-10-07 已保存全球及中文两组新截图并重新进入商品页核对，成功提交资料审核。凭据：dist/store-assets/chrome-real-screenshots-in-review.json。

## 2026-10-20 公开截图核验

- 英文商品页画廊共两张截图：第 1 张为真实浅色，第 2 张为真实深色，均非旧演示预览图。
- 从商品页的 `data-media-url` 读取两张资源地址，下载页面引用的 1280×800 PNG；SHA-256（Secure Hash Algorithm 256-bit，256 位安全散列算法）与仓库提交版完全相同。
- 与 `assets/screenshots/shigang-light-1920x1080.png`、`shigang-dark-1920x1080.png` 对照，提示词、正文与右侧目录内容相同；商店 16:10 与 README 16:9 的构图差异来自不同裁剪。
- 原图固定版本、资源地址和文件摘要见[核验记录](docs/store-listing-verification-2026-10-20.md)。本次只更新文档，没有重新提交安装包或更改扩展代码。

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

此前 1.0.1、1.0.2 包和提交截图保留为历史资料。1.0.2 提交包 SHA256 为 8653f5d47648afb91d562268bf858eb28b8caedda77a67b48d6dbdaf123c9dd0，主要包含 Markdown/MathML 修复。本次取消其审核，替换为包含宽度调节、正文避让、阅读跟随、缓存会话切换修复和品牌国际化的 1.0.3 后重新提交。最新公开展示核验及其范围以本页开头为准；本次没有取得新的后台审核记录。

Edge 使用同一份 1.0.3 ZIP，现已公开上架；详情见 EDGEADDONS.md。

## 官方依据

- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/webstore/cws-dashboard-listing
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- https://developer.chrome.com/docs/extensions/reference/api/i18n
