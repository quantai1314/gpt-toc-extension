# Microsoft Edge Add-ons 发布记录

## 1.0.4 已提交审核（2026-10-20）

- 后台已识别 `shigang-chatgpt-outline-1.0.4.zip`，版本 1.0.4，English 与 Chinese (China)，包验证状态 Complete。
- 包为 `dist/shigang-chatgpt-outline-1.0.4.zip`，33,759 字节；SHA-256：`a235fd5dde3eff25b7571b1f7fb1da923c33351e4160d501e4b2f52b14240e65`。与 GitHub v1.0.4 附件为同一份包。
- 中英文说明均已保存并核对，保留两种语言原有图标、宣传图和真实浅色／深色截图。审核备注使用 `store-listings.json` 的最新测试说明。
- 点击最终 Publish 后，后台更新条目明确显示 **Version 1.0.4 / In review**，现有 **Version 1.0.3 / Live**；尚未确认新版审核通过或公开生效。
- 提交凭据：`dist/store-assets/edge-submitted-1.0.4.jpg`。后台提示预计 7 个工作日内回复，该提示不代表实际审核期限保证。
- 权限未增加；ZIP 完整性、12 项文件白名单和源码逐项一致性检查通过，功能代码通过 59 项 Chrome 浏览器回归。未新增 Edge 实际安装测试。
- 本版包含思考／工具活动去重、自动扫描与保留历史目录、旧标题补载定位、渲染错误重试及上下文失效后的本地化回退。
- [GitHub v1.0.4](https://github.com/quantai1314/gpt-toc-extension/releases/tag/v1.0.4)；Chrome 的同版本因后台访问限制尚未上传，见 `CHROMEWEBSTORE.md`。

## 1.0.3 历史记录与公开核验

截至 2026-10-20（Asia/Shanghai），**拾纲 Shigang 1.0.3 仍公开上架**。英文公开商品页显示 Version 1.0.3、Updated October 4, 2026；2026-10-07 提交的真实浅色、深色截图均已在公开画廊展示。两张公开 JPEG 与仓库 1280×800 提交版画面一致，存在压缩差异，不能宣称文件逐字节相同。

此前于 2026-10-04 首次提交审核；2026-10-07 提交截图资料更新时，后台更新条目记录为 In review，现有 1.0.3 条目为 Live。这些仅为当日历史状态；该次公开截图核验未访问开发者后台，当时未核实最新正式审核状态、确切批准和生效日期。公开截图已替换不等同于取得后台审核结论，商品页的 2026-10-04 更新时间也不能用于推断此次截图更新日期。验证仅覆盖本次英文公开商品页及其图片资源，不推定全部语言、地区或缓存已同步。

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
- 英文与中文商品页截图：assets/screenshots/shigang-light-1280x800.png、shigang-dark-1280x800.png。
- 两张为用户提供的真实 ChatGPT 公开知识示例对话截图，已裁掉账号头像和左侧导航；图片中的示例对话与目录标签为中文。仅做裁剪及等比缩放，未重绘文字。
- 使用 1280×800 RGB PNG；已上传中文详情、复制到英文详情，保存后进入英文页核对两张新文件名。原演示截图本地保留。
- 本次保留原 1.0.3 包，在审核备注明确只有商品截图更新、无代码或权限变化，并成功提交。凭据：dist/store-assets/edge-real-screenshots-in-review.json。
- 网站：https://github.com/quantai1314/gpt-toc-extension。
- 支持：https://github.com/quantai1314/gpt-toc-extension/issues。
- 隐私政策：https://github.com/quantai1314/gpt-toc-extension/blob/main/PRIVACY.md。

## 2026-10-20 公开截图核验

- 成功读取英文公开商品页，并在浏览器画廊确认两张真实截图：第 1 张浅色、第 2 张深色；不是旧演示预览图。
- 从画廊 `Product image` 元素获取两张实际加载的图片地址，均为 1280×800 JPEG。
- 与仓库同尺寸 PNG 比较：浅色的平均绝对像素差为 0.649，深色为 0.902（RGB 三通道、每通道 0–255）。结合提示词、正文、目录标题与布局的目视核对，确认内容一致；JPEG 与 PNG 文件摘要不同。
- 同时对照 README 的 1920×1080 原图，确认是相同示例场景、不同裁剪；资源地址、文件摘要和方法见[核验记录](docs/store-listing-verification-2026-10-20.md)。
- 本次没有进行 Edge 安装或功能测试，没有重新提交安装包或更改扩展代码。

## 权限与验证

storage 仅在本机保存侧栏宽度数字；ChatGPT 两个域名的权限仅用于处理已加载的问题和回答标题。声明不使用远程代码；披露 Personal communications 与 Website content 在本地处理，无对话上传或遥测，并确认三项实际数据用途声明。审核说明要求使用审核者自己的 ChatGPT 账号测试，无扩展独立账号或付费功能。

本地 36 项 Chromium 回归检查、语法检查、ZIP 完整性及源码一致性检查通过；中英文、深浅色预览已检查。未新增 Edge 浏览器实际安装测试，不把后台包验证视为功能测试或商店审核通过。搜索资料已配置，排名与索引时间由商店决定。

官方说明：https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension
