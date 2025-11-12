/** @type {import('next-sitemap').IConfig} */
const SiteUrlWithBase = require('./data/siteConfig.mjs').SiteUrlWithBase
const isAllowRobots = require('./data/siteConfig.mjs').SiteConfig.isAllowRobots
const robotsPolicies = isAllowRobots
  ? [{ userAgent: '*', allow: '/' }]
  : [{ userAgent: '*', disallow: '/' }]

module.exports = {
  siteUrl: `${SiteUrlWithBase}`,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: robotsPolicies,
  },
  outDir: './out',
}
