/** @type {import('next-sitemap').IConfig} */
const SITE_URL_WITH_BASE = require('./data/siteConfig.mjs').SiteUrlWithBase
const IS_ALLOW_ROBOTS = require('./data/siteConfig.mjs').SiteConfig.isAllowRobots
const ROBOTS_POLICES = IS_ALLOW_ROBOTS
  ? [{ userAgent: '*', allow: '/' }]
  : [{ userAgent: '*', disallow: '/' }]

module.exports = {
  siteUrl: `${SITE_URL_WITH_BASE}`,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: ROBOTS_POLICES,
  },
  outDir: './out',
}
