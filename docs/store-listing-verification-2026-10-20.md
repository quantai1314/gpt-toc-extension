# 拾纲 v1.0.3 商店公开展示核验（2026-10-20）

## 结论与验证范围

核验日期：2026-10-20（Asia/Shanghai）。对象为拾纲 Shigang 的 Chrome Web Store 与 Microsoft Edge Add-ons **英文公开商品页**及页面引用的两张截图。两家画廊均已展示 2026-10-07 提交的真实浅色、深色示例，未再展示旧演示预览图。

| 商店 | 公开版本 | 商品页标记的更新时间 | 浅色截图 | 深色截图 | 最新正式审核状态 |
| --- | --- | --- | --- | --- | --- |
| Chrome Web Store | 1.0.3 | 2026-10-08 | 与仓库 1280×800 PNG 逐字节一致 | 与仓库 1280×800 PNG 逐字节一致 | 未核实，未访问开发者后台 |
| Microsoft Edge Add-ons | 1.0.3 | 2026-10-04 | JPEG 画面与仓库提交版一致，有压缩差异 | JPEG 画面与仓库提交版一致，有压缩差异 | 未核实，未访问开发者后台 |

依据为下列官方商店公开页、页面引用的商品截图，以及本仓库截图资产。本次没有开发者后台审核记录或审核邮件作为证据。因此：

- 2026-10-07 的 Chrome 待审核、Edge In review 是历史提交状态，不能作为 2026-10-20 的当前状态。
- 截图已公开展示只证明本次访问的公开展示结果，不等同于已取得正式审核通过状态。
- 不能确定确切批准日期或首次公开生效日期，也不能由商品页更新时间推断。
- 未逐一检查其他语言、地区或缓存；未进行扩展安装或功能测试。
- 只更新发布文档，未更改扩展源码、版本、权限、安装包或商店资料，未重新提交 v1.0.3。

## 来源与方法

### 官方商品页

- [Chrome Web Store](https://chromewebstore.google.com/detail/shigang-chatgpt-table-of/gnkgnojbcclcfjelkijmhaaboidhnehk)：公开 HTML 的语言为 en-US，版本 1.0.3，Updated October 8, 2026。提取带截图标签的画廊元素及其 `data-media-url`，按 `data-slide-index` 确认顺序；下载页面引用的 `=s1280-w1280-h800` 图片。HTML 中轮播克隆元素去重后共两张截图。
- [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/shigang-chatgpt-table-o/kojdleblcoelmniokkifjjfhmjeaddfj)：浏览器实际跳转后的英文商品页，显示 Version 1.0.3、Updated October 4, 2026。读取画廊的两个 Product image 元素及实际图片地址，并目视确认公开画廊。公开 HTML 的两张预加载资源与浏览器实际加载资源一致。
- Edge 在 Chrome 浏览器中显示“Incompatible with your browser”是该访问浏览器的安装提示；本次未尝试安装，不据此判断 Edge 扩展的可用性或审核状态。

### 仓库原图

比对基线固定为提交 [569055ba39e5542f0e06b215fcd5f8b79e683f33](https://github.com/quantai1314/gpt-toc-extension/commit/569055ba39e5542f0e06b215fcd5f8b79e683f33)，避免后续 main 分支变化使证据不明确：

- [浅色 1280×800 提交版](https://github.com/quantai1314/gpt-toc-extension/blob/569055ba39e5542f0e06b215fcd5f8b79e683f33/assets/screenshots/shigang-light-1280x800.png)
- [深色 1280×800 提交版](https://github.com/quantai1314/gpt-toc-extension/blob/569055ba39e5542f0e06b215fcd5f8b79e683f33/assets/screenshots/shigang-dark-1280x800.png)
- [浅色 1920×1080 README 版](https://github.com/quantai1314/gpt-toc-extension/blob/569055ba39e5542f0e06b215fcd5f8b79e683f33/assets/screenshots/shigang-light-1920x1080.png)
- [深色 1920×1080 README 版](https://github.com/quantai1314/gpt-toc-extension/blob/569055ba39e5542f0e06b215fcd5f8b79e683f33/assets/screenshots/shigang-dark-1920x1080.png)

商店提交版是 16:10，README 版是 16:9，不能直接要求两种尺寸文件相同。目视逐一核对了同一中文提示词（“请介绍如何用 ChatGPT 提高日常工作效率”）、正文“信息整理／整理长篇材料”、右侧“拾纲·对话目录”及目录结构、底部输入框与主题。两种尺寸均为相同示例场景的不同裁剪。

### 图片比对

1. 从上述商品页获取实际截图地址，下载图片并解码；两家各两张，均为 1280×800。
2. Chrome 下载图为 PNG，分别与仓库同尺寸浅色、深色文件比较 SHA-256（Secure Hash Algorithm 256-bit，256 位安全散列算法），两张均相同，确认逐字节一致。
3. Edge 下载图为 JPEG，与仓库 PNG 文件摘要不同；不作文件一致声明。将图片解码为 RGB（Red, Green, Blue，红、绿、蓝）三通道，在原始尺寸逐像素比较，无缩放或配准。
4. 计算 MAE（Mean Absolute Error，平均绝对误差）与 RMSE（Root Mean Square Error，均方根误差），每个通道取值为 0–255；目视核对提示词、正文和目录布局后，判断是相同画面并有压缩差异。数值用于辅助，不单独作为内容一致的结论依据。

| Edge 资源 | 对应仓库提交版 | MAE | RMSE | 目视结果 |
| --- | --- | --- | --- | --- |
| 第 1 张，浅色 | shigang-light-1280x800.png | 0.649049 | 1.898104 | 提示词、正文、目录与布局一致 |
| 第 2 张，深色 | shigang-dark-1280x800.png | 0.901871 | 2.438606 | 提示词、正文、目录与布局一致 |

## 公开图片地址

### Chrome

第 1 张，浅色：

https://lh3.googleusercontent.com/adGmKUVzYjmocIjATcbgw0_ut0J8WZ0Lzf1vxaFK40VfaVPMAoYqvRmZF9QUwoiopxuwOBWLoTH7_ty5113_GxW-V88=s1280-w1280-h800

第 2 张，深色：

https://lh3.googleusercontent.com/lcRxbiCWDx0p42kGxyHYBbJuvaUM5eGQcsiXzr8ZgWLa_oonqpNpQw1YrcrfFoXH5biURrfEasZb1sX-nXPzErGzew=s1280-w1280-h800

### Edge

第 1 张，浅色：

https://store-images.s-microsoft.com/image/apps.26358.2bc8f9fe-0add-4628-b2dc-92d66f44cc06.cebcfd86-dbf2-47bb-9e30-2f8667572b95.fc023769-a3a3-40b8-949f-e226f0c52394

第 2 张，深色：

https://store-images.s-microsoft.com/image/apps.33702.2bc8f9fe-0add-4628-b2dc-92d66f44cc06.cebcfd86-dbf2-47bb-9e30-2f8667572b95.e33c1646-277d-42d7-a7a1-ea1e30704534

资源地址及返回编码可能随商店更新而变化，以下摘要只对应本次下载结果。

## SHA-256 文件摘要

| 文件或资源 | SHA-256 |
| --- | --- |
| 仓库浅色 1280×800 PNG；Chrome 第 1 张 PNG | `f66669fe93b519de5dd4baabaf7bb86aacc1538361ae3e3677941eaf2cbb3476` |
| 仓库深色 1280×800 PNG；Chrome 第 2 张 PNG | `a6833cbc5e9c0190481c077184e8954c75f9e60f0cec9625b6d8f8accdab1fb6` |
| Edge 第 1 张 JPEG，浅色 | `d6cf718c99b5c9a1fa9f2306fde75ffc94e644484964b7ca003de083f2352a81` |
| Edge 第 2 张 JPEG，深色 | `7528ccc17e46c72d55ae40e5245adae78475d0a3eee1fc740d7f17c1e28611f5` |
| 仓库浅色 1920×1080 PNG | `53bb27c0e0b43eb2233b6655ac63be3087a0b477337f9a04bea9994c81ed2557` |
| 仓库深色 1920×1080 PNG | `4310cd281aa659242ba9161c42f43a71cc1eeb4c3d01eafb327f10187e11db79` |
