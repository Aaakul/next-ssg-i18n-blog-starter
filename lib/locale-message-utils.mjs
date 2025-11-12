/**
 * @param {string} locale
 * @returns {Promise<Record<string, any> | undefined>}
 */

export default async function getMessageByLocale(locale) {
  try {
    return (await import(`../i18n/messages/${locale}.json`, { with: { type: 'json' } })).default
  } catch (_err) {
    return undefined
  }
}
