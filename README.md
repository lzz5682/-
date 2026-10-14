# 黑流树海 · 个人主页

一个「黑流树海」风格的静态个人主页。零依赖、零构建，双击 `index.html` 即可预览。

> 黑流之下，树海之中。

## 目录结构

```
homepage/
├── index.html              # 页面主体，所有文案都在这里
├── assets/
│   ├── css/style.css       # 全部样式（调色板在文件开头的 :root 里）
│   └── js/main.js          # 粒子、滚动动画、导航交互
├── .nojekyll               # 让 GitHub Pages 跳过 Jekyll 处理
└── README.md
```

## 已填好的内容

| 位置 | 当前值 |
| --- | --- |
| 页面标题 | 李志卓 · 黑流树海 |
| 大标题 | 李志卓 / LIZHIZHUO |
| 签名 | 我于此言语，即为丧钟的王庭。 |
| GitHub | [@lzz5682](https://github.com/lzz5682) |
| 哔哩哔哩 | IGD乱糟糟 |
| 邮箱 | 22300548@qq.com |

## 还需要你自己补的内容

下面这几处目前是**示例文案**，在 `index.html` 里都标了 `【占位区】` 注释，改掉就行：

1. **「关于我」的自我介绍和时间线**（搜索 `【占位区】` 第 1 处）
   现在是通用的开发者自述，建议换成你自己的话。也可以直接让我帮你重写。
2. **「作品」三张卡片**（第 2 处）
   把 `项目名称一` 换成项目名、`<p>` 换成一句话描述、`card-tech` 里的 `<li>` 换成技术栈。
3. **「随笔」四条日志**（第 3 处）
   日期、标题、标签。将来接真实文章时，把 `href="#"` 换成文章地址即可。
4. **据点 BASE**：Hero 区显示的是 `—— 待录入`，想显示城市就改掉。
5. **B 站链接**：现在指向 bilibili 搜索「IGD乱糟糟」。拿到你的 UID 后，把 `href` 改成
   `https://space.bilibili.com/你的UID` 更准确。
6. **头像**：目前是内嵌的 SVG 占位图。想换成照片，把图片放进 `assets/img/`，
   再把 `<img class="portrait-img" ...>` 的 `src` 改成 `assets/img/avatar.jpg`。


## 改配色

所有颜色都在 `assets/css/style.css` 最上面的 `:root` 里，改这一处即可全局生效：

```css
--void: #05090a;   /* 最深的墨底 */
--jade: #1d4a42;   /* 树海的青绿 */
--gold: #c9a86a;   /* 金色细线 */
--ember:#f0a83c;   /* 橙黄微光 */
--bone: #cdc8b8;   /* 正文纸张色 */
```

## 线上部署

| 项 | 值 |
| --- | --- |
| 仓库 | https://github.com/lzz5682/- |
| 发布方式 | Deploy from a branch |
| 分支 / 目录 | `main` / `(root)` |
| 访问地址 | **https://lzz5682.github.io/-/** |

代码已经推上去了。**最后一步是要在网页上开启一次 Pages**（仓库管理员权限才行，脚本做不了）：

1. 打开 https://github.com/lzz5682/-/settings/pages
2. **Source** 选 `Deploy from a branch`
3. **Branch** 选 `main`，目录选 `/ (root)`，点 **Save**
4. 等 1 分钟左右，访问 https://lzz5682.github.io/-/

开启之后就不用再管了 —— 以后每次改完内容 `git push`，网站会自动重新发布。

### 以后更新的流程

```bash
git add .
git commit -m "update: 改了什么"
git push
```

### 为什么不用自定义域名

仓库名是 `-`，URL 里会多一截 `/-/`。如果以后想要更干净的
`https://lzz5682.github.io/`，有两种改法：

- 把仓库改名为 `lzz5682.github.io`（Settings → Repository name），Pages 会直接跟着改
- 或者买个域名，在 Pages 设置里填 Custom domain

两种改法都不用动代码，因为这个站点的资源路径全部是相对路径。


## 本地预览

直接双击 `index.html` 就能看。想用本地服务器（推荐，行为与线上完全一致）：

```bash
npx serve .
# 或
python -m http.server 8000
```

---

字体通过 Google Fonts 加载（思源宋体 / Cormorant Garamond / JetBrains Mono）。如果网络无法访问，会自动回退到系统自带宋体与等宽字体，页面依然完整可用。
