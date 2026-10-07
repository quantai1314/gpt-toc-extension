# Microsoft Edge Add-ons 发布记录

截至 2026-10-07（Asia/Shanghai），**拾纲 Shigang 已公开上架**，公开商品页已核对可访问。发布版本为本次提交的 1.0.3；此前于 2026-10-04 首次提交审核。

- 发布者：Quantai。
- Product ID：2bc8f9fe-0add-4628-b2dc-92d66f44cc06。
- Store ID：0RDCKFTTP8VZ。
- CRX ID：kojdleblcoelmniokkifjjfhmjeaddfj。
- 后台：https://partner.microsoft.com/en-us/dashboard/microsoftedge/2bc8f9fe-0add-4628-b2dc-92d66f44cc06/packages/dashboard
- 公共商店链接：[Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/kojdleblcoelmniokkifjjfhmjeaddfj)。
- GitHub 发行：[v1.0.3](https://github.com/quantai1314/gpt-toc-extension/releases/tag/v1.0.3)。
- 提交凭据：dist/store-assets/edge-submitted-1.0.3.jpg。

## 包与分发

- 英文名称：Shigang - ChatGPT Table of Contents。
- 中文名称：拾纲 Shigang - ChatGPT 对话目录。
- 版本：1.0.3；默认语言 en，另含 zh_CN。
- 分类：Productivity。
- 分发：Public；全部 241/241 市场，并开启未来新增市场。
- 包：dist/shigang-chatgpt-outline-1.0.3.zip；与 Chrome 提交的是同一份 ZIP。
- SHA256：2dd46e628b566efe31a08213ea3bfa815041c3a2a38274389d3a6732ad325f99。
- 包验证：后台识别 English、Chinese (China)，版本 1.0.3，状态 Complete，显示包已验证。

## 商店资料

English 与 Chinese (China) 两种语言均显示 Complete。说明、7 个搜索词、权限理由和审核说明的源数据见 store-listings.json。

- 英文搜索词：ChatGPT table of contents、ChatGPT outline、conversation navigation、chat sidebar、heading navigation、reading follow、Shigang。
- 中文搜索词：ChatGPT 对话目录、ChatGPT 目录、对话导航、阅读跟随、数学公式、拾纲、Shigang。
- 图标：dist/store-assets/shigang-edge-logo-300.png，复制至两种语言。
- 英文宣传图：shigang-promo-en-440x280.png；中文宣传图：shigang-promo-440x280.png。
- 英文截图：shigang-en-light-1280x800.png、shigang-en-dark-1280x800.png。
- 中文截图：shigang-zh-light-1280x800.png。
- Edge 上传界面实际只接受 PNG，原 JPEG 截图转成 RGB PNG 后上传。截图运行实际代码和示例内容，明确标注演示预览。
- 网站：https://github.com/quantai1314/gpt-toc-extension。
- 支持：https://github.com/quantai1314/gpt-toc-extension/issues。
- 隐私政策：https://github.com/quantai1314/gpt-toc-extension/blob/main/PRIVACY.md。

## 权限与验证

storage 仅在本机保存侧栏宽度数字；ChatGPT 两个域名的权限仅用于处理已加载的问题和回答标题。声明不使用远程代码；披露 Personal communications 与 Website content 在本地处理，无对话上传或遥测，并确认三项实际数据用途声明。审核说明要求使用审核者自己的 ChatGPT 账号测试，无扩展独立账号或付费功能。

本地 36 项 Chromium 回归检查、语法检查、ZIP 完整性及源码一致性检查通过；中英文、深浅色预览已检查。未新增 Edge 浏览器实际安装测试，不把后台包验证视为功能测试或商店审核通过。搜索资料已配置，排名与索引时间由商店决定。

官方说明：https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension
