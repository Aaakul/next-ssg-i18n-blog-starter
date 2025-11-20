export const SiteConfig = {
  defaultAuthorName: 'Luka',
  defaultLocale: 'zh',
  localeDisplayNames: {
    zh: '简体中文',
    en: 'English',
    ja: '日本語',
  },
  defaultTheme: 'system', //'system' | 'dark' | 'light'
  siteUrl: process.env.SITE_URL?.replace(/\/+$/, '') || 'http://127.0.0.1:3000',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // 导航栏是否在滚动时固定在顶部
  // Whether the navbar remains fixed at the top while scrolling
  // ナビゲーションバーがスクロール中にトップに固定されるかどうか
  isStickyNav: true,

  // 是否允许爬虫（true：允许，false：禁止）。注：AI 爬虫始终不允许
  // Crawler access policies (true: allowed, false: disallow). Note: AI crawlers are never allowed.
  // クローラーを許可するかどうか（`true` = 許可, `false` = 不許可）。注：AIクローラーは常に許可されていません
  isAllowRobots: true,

  // 构建后是否生成 RSS Feed
  // Whether to generate RSS feed after the build process
  // ビルド後に RSS フィードを生成するかどうか
  isGenRSS: true,

  // next-intl 的 Cookie 最大有效期。使用数字（天），'session' 或 'none'
  // Maximum expiration time for next-intl cookies. Use a number (days), 'session', or 'none'
  // next-intl の Cookie の最大有効期間。数値（日数）、'session'、あるいは 'none' を使用します
  cookieMaxAgeDays: 'session',

  // 列表视图每页显示的博客文章数量
  // Number of blog posts displayed per page in list views
  // リストビューで 1 ページに表示されるブログ記事の数
  postsPerPage: 2,

  social: {
    // 页脚会显示对应社交平台的图标及链接
    // The footer will display the corresponding social platform icons with links
    // フッターには対応するソーシャルプラットフォームのアイコンとリンクが表示されます
    mail: 'address@yoursite.com',
    github: 'https://github.com/aaakul',
    bilibili: '',
    youtube: '',
    mastodon: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    threads: '',
    instagram: '',
    medium: '',
    bluesky: '',
  },
}

/**
 * @typedef {Record<string, string>} LocaleDisplayMap
 * @typedef {keyof SiteConfiguration["localeDisplayNames"]} Locale
 */

/**
 * @typedef {Object} SocialConfig
 * @property {string} [mail]
 * @property {string} [github]
 * @property {string} [bilibili]
 * @property {string} [youtube]
 * @property {string} [x]
 * @property {string} [mastodon]
 * @property {string} [twitter]
 * @property {string} [facebook]
 * @property {string} [linkedin]
 * @property {string} [threads]
 * @property {string} [instagram]
 * @property {string} [medium]
 * @property {string} [bluesky]
 */

/**
 * @typedef {Object} SiteConfig
 * @property {string} defaultAuthorName
 * @property {string} defaultLocale
 * @property {LocaleDisplayMap} localeDisplayNames
 * @property {'system' | 'dark' | 'light'} defaultTheme
 * @property {string} siteUrl
 * @property {string} basePath
 * @property {boolean} isStickyNav
 * @property {boolean} isAllowRobots
 * @property {boolean} isGenRSS
 * @property {'session' | 'none' | number} cookieMaxAgeDays
 * @property {number} postsPerPage
 * @property {SocialConfig} social
 */

export const SocialBannerPath = `${SiteConfig.basePath.replace(/\/+$/, '')}/static/images/twitter-card.png`

export const SiteUrlWithBase = new URL(
  `${SiteConfig.siteUrl.replace(/\/+$/, '')}${SiteConfig.basePath}`
).href.replace(/\/+$/, '')

const cookieMaxAge = (() => {
  const value = SiteConfig.cookieMaxAgeDays
  if (typeof value === 'number' && value >= 0) {
    return value * 3600 * 24
  }
  if (value === 'none') {
    return 0
  }
  return undefined
})()

export { cookieMaxAge }
