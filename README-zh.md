# Next SSG i18n Blog Starter

- [English](README.md)
- [日本語](README-ja.md)

## 动机

我对 Next.js 的静态站点生成(SSG)能力很感兴趣, 于是选择广受欢迎的 [Tailwind Next.js Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) 作为开发个人博客的起点。但在集成国际化(i18n)时, 发现 i18n 与 SSG 存在诸多兼容性问题。

尝试了不同的方案后, 我最终采用 [next-intl](https://next-intl.dev/) 实现了稳定、高效的 i18n 支持, 这个项目也由此诞生。这是一个开箱即用的博客模板, 即使缺少编程经验, 也可以轻松完成多语言博客的搭建。同时, 也希望本项目能为SSG与i18n的共存提供参考。

## 特性

本模板在保留 Tailwind Next.js Starter Blog [核心功能](https://github.com/timlrx/tailwind-nextjs-starter-blog#features)的基础上, 集成了国际化, 并进一步增强了开发体验。主要特性包括:

- **良好的用户体验**: Lighthouse 评分接近满分。
- **开箱即用的国际化**: 集成 [next-intl](https://next-intl.dev/), 支持SSG。
  - 自动检测浏览器语言环境
  - 通过 Cookie 持久化用户语言偏好(支持配置过期时间, 便于满足 GDPR 等合规要求。默认为 Session Cookie)
  - 内置简体中文、英文和日文翻译
- **国际化 SEO 优化**:
  - 自动生成 `<link rel="alternate" hreflang="...">` 标签, `Metadata` 与 `Open Graph` 标签
  - 通过 [next-sitemap](https://github.com/iamvishnusankar/next-sitemap) 在构建时生成多语言 `sitemap` 与 `robots.txt`
- **多语言 RSS/Atom 订阅支持**: 使用 [feed](https://github.com/jpmonette/feed) 在构建阶段为每种语言生成独立的静态 Feed 文件
- **现代化样式系统**: 基于 [Tailwind CSS v4.1](https://tailwindcss.com/), 轻松定制样式。
- **零配置站内搜索**: 修改自 [`pliny/search`](https://github.com/timlrx/pliny/tree/main/packages/pliny/src/search), 基于 [`KBar`](https://github.com/timc1/kbar)提供。
- **现代化的Markdown写作**:
  - 支持 [MDX](https://mdxjs.com/), 在 Markdown 中直接嵌入 JSX/React 组件
  - 由 [contentlayer2](https://github.com/timlrx/contentlayer2) 处理Markdown/MDX文件
  - 代码高亮由 [`rehype-pretty-code`](https://rehype-pretty.pages.dev) 实现, 支持行号与高亮。代码复制修改自[`pliny/ui/Pre`](https://github.com/timlrx/pliny/blob/main/packages/pliny/src/ui/Pre.tsx)
  - 数学公式渲染采用 [KaTeX](https://katex.org/)
  - 支持 [GitHub 风格提示框](https://docs.github.com/zh/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax), 通过 [remark-github-blockquote-alert](https://github.com/jaywcjlove/remark-github-blockquote-alert) 实现

---

## 快速开始

1. **克隆仓库**

   ```bash
   git clone https://github.com/Aaakul/next-ssg-i18n-blog-starter.git
   ```

2. **安装依赖**

   ```bash
   cd next-ssg-i18n-blog-starter
   npm install
   ```

3. **配置站点信息**
   编辑 `./data/SiteConfig.mjs`, 设置网站基础信息和社交媒体链接。

4. **本地化内容**
   修改 `./i18n/messages/*.json` 中的以下字段:
   - `header_title`: 导航栏标题
   - `site_title`: 网站标题
   - `site_description`: 网站描述

5. **替换图标与头像**
   更新以下文件:
   - 网站图标: `./app/favicon.ico`、`./app/apple-touch.png`、`./public/favicon.svg`
   - 默认作者头像: `./public/static/images/avatar.svg`

6. **自定义项目页**
   编辑 `./data/projectsData.ts` 以更新项目列表。

7. **配置作者信息**
   编辑对应语言的 `./data/authors/.../default.md`(参考“Markdown / MDX - 作者页”部分)。

8. **添加博客文章**
   在 `./data/blog/` 目录中新增 Markdown 文件(参考“Markdown / MDX - 文章”部分)。

---

## 开发

使用 Turbopack 启动开发服务器:

```bash
npm run dev
```

> [!NOTE]
> 如果你正在编辑 Markdown 文件或修改 Contentlayer 配置, 并希望获得实时热更新, 请改用 Webpack 模式:

```bash
npm run dev:webpack
```

> [!TIP]
> 如需手动构建 Contentlayer 内容

```bash
npm run contentlayer
```

## 扩展与自定义

### 国际化(i18n)

项目已内置简体中文(`zh`)、英文(`en`)和日文(`ja`)支持, 翻译文件位于 `./i18n/messages/` 。
你可以优化现有翻译, 或添加更多语言。

### 其他个性化配置

- **样式定制**  
  通过 `tailwind.config.js` 和 `styles/*.css` 调整 Tailwind 配置与CSS样式, 轻松修改整体外观。
- **MDX 组件**  
  在 `components/MDXComponents.tsx` 中注册可在 `.mdx` 或 `.md` 文件中使用的自定义 React 组件。
  **注意: 组件请使用默认导出, 以避免 Next.js 的** [已知问题](https://github.com/vercel/next.js/issues/51593)
- **导航栏**  
  修改 `./components/Header.tsx` 以自定义顶部导航链接。
- **文章布局**  
  文章页面支持三种布局(位于 `./layouts/`):
  - `PostLayout`(默认): 两栏布局, 含侧边目录
  - `PostSimple`: `PostLayout` 精简版 , 无侧边目录
  - `PostBanner`: 顶部带横幅图的布局, 无侧边目录

  可在文章 Frontmatter 中通过 `layout` 字段指定使用哪种布局。

## Markdown / MDX

项目使用 [Contentlayer](https://www.contentlayer.dev/docs/getting-started) 处理 `.md` 和 `.mdx` 文件。

### Frontmatter

Frontmatter 遵循 [Hugo 的标准格式](https://gohugo.io/content-management/front-matter/), 具体字段定义见 `./contentlayer.config.ts`

#### 作者页(`./data/authors/**/*.mdx`)

**必需字段:**

```ts
name: string
language: string // 必须与 `SiteConfig` 中配置的语言一致
```

**可选字段:**

```ts
occupation: string
company: string
mail: string
twitter: string
bluesky: string
linkedin: string
github: string
```

#### 文章(`./data/blog/**/*.mdx`)

**必需字段:**

```ts
title: string
date: string // 如 '2025-01-01T16:35:00+08:00'
translationKey: string // 用于关联多语言版本的文章
language: string // 必须与 `SiteConfig` 中的语言配置一致
```

**可选字段:**

```ts
tags: string[]
lastmod: string            // 最后修改日期
draft: boolean             // 设为 true 时文章不会被构建
summary: string            // 文章摘要
images: string[]           // 用于 Open Graph 等 meta 标签的图片 URL 列表
authors: string[]          // 对应 `./data/authors/` 下的文件名, 默认为 ['default']
layout: string             // 页面布局, 如未指定则使用 'PostLayout'
isCanonical: boolean       // 设为 true 时会添加 <link rel="alternate" hreflang="x-default" ...> 标签, 默认 false
```

---

**示例: 包含所有 Frontmatter 字段的文章**

```mdx
---
title: 'Introducing'
translationKey: 'intro'
date: '2025-01-01'
lastmod: '2025-11-11'
tags: ['next-js', 'tailwind', 'guide']
draft: false
language: 'en'
summary: 'In this article...'
images: ['/static/images/img1.jpg', '/static/images/img2.jpg']
authors: ['default', 'test']
layout: PostLayout
isCanonical: true
---

# H1 Title

Some content...

{/* 内置目录组件 */}

<TOCInline toc={props.toc} exclude="section to be excluded" toHeading={2} />
```

> [!IMPORTANT]
> `translationKey` 是实现多语言文章关联的关键字段, 请确保同一内容的不同语言版本使用相同的值

## 部署

本项目专为SSG设计, 可轻松部署到任何静态托管平台, 例如 GitHub Pages、Cloudflare Pages、AWS S3 、Firebase Hosting。

### 手动部署

- **更小的打包体积**  
  使用 Webpack 构建:

  ```sh
  npm run export
  ```

- **更快的构建速度**  
  使用 Turbopack 构建:

  ```sh
  npm run export:turbo
  ```

构建完成后, 将生成的 `out` 目录上传至你的静态托管服务。

### 预览部署效果

构建完成后, 可通过以下命令本地预览:

```sh
npx serve out
```

然后在浏览器中打开剪贴板中的链接查看效果。 默认为 [http://localhost:3000](http://localhost:3000)

### GitHub Pages 自动化部署

未来将提供 `.github/workflows/pages.yml` 配置文件, 启用后可自动构建并部署到 GitHub Pages。

### Cloudflare Pages 自动化部署

1. **Fork 本仓库**
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com), 进入 **Workers 和 Pages**。
3. 点击 **创建应用程序 - Pages - 导入现有 Git 存储库**, 将你的Github账户与Cloudflare账户关联后, 选择你 Fork 的仓库。
4. 构建设置如下:
   - **框架预设**: `Next.js(Static HTML Export)`
   - **构建命令**: `npm run export`
   - **构建输出目录**: `out`
5. 点击 **保存并部署**, Cloudflare 将自动完成首次构建与部署。

后续每次推送代码, Cloudflare Pages 都会自动触发新构建。

## FAQ

### `basePath` 配置

请在 `./data/SiteConfig.mjs` 中设置 `basePath` 字段, 用于部署到子路径(如 `https://example.com/blog/`)。

### 自定义 `kbar` 命令面板

- [使用 kbar 加入 Command Palette 指令面板 - Modern Next.js Blog 系列 #26](https://easonchang.com/zh-TW/posts/kbar-command-palette)
- [How can I customize the `kbar` search?](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/main/faq/customize-kbar-search.md)

### 自定义 MDX 组件

- [How can I add a custom MDX component?](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/main/faq/custom-mdx-component.md)

## 开发计划

计划在未来版本中逐步完善以下功能(顺序不分先后):

- **从原模板中移除的功能**: 评论系统、网站分析、引用与参考文献支持
- **新增实用功能**: 文章底部版权声明组件

## 致谢

本项目基于 [`Tailwind Next.js Starter Blog`](https://github.com/timlrx/tailwind-nextjs-starter-blog)和[`Pliny`](https://github.com/timlrx/pliny) 开发。
非常感谢 [Timothy Lin (timlrx)](https://github.com/timlrx) 为社区贡献高质量的博客模板与工具库。

## 版权

本项目采用 [MIT 许可证](LICENSE)
