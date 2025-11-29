import { defaultLocale, supportedLocales } from '@/i18n/'
import { SiteConfig } from '@/data/siteConfig.mjs'

const serializedDefaultLocale = JSON.stringify(defaultLocale)
const serializedBasePath = JSON.stringify(SiteConfig.basePath)
const serializedCookieMaxAgeDays = JSON.stringify(SiteConfig.cookieMaxAgeDays)

const redirectScript = `
  (function() {
    const defaultLocale = ${serializedDefaultLocale};
    const supportedLocales = ${JSON.stringify(supportedLocales)};
    const basePath = ${serializedBasePath};
    const cookieConfig = ${serializedCookieMaxAgeDays};
    const COOKIE_NAME = 'NEXT_LOCALE'; 

    const checkLocale = (locales, lang) => {
      // full match
      if (locales.indexOf(lang) !== -1) { 
        return lang;
      }
      // partial match
      const langPrefix = lang.split('-')[0];
      for (const supported of locales) {
        if (supported.startsWith(langPrefix)) {
          return supported;
        }
      }
      return null;
    };
    
    let preferredLocale = defaultLocale;

    const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)')); 
    const localeInCookie = match ? match[2] : null;

    if (localeInCookie && checkLocale(supportedLocales, localeInCookie)) {
      preferredLocale = localeInCookie;
    } else {
      const languages = [...(navigator.languages || [])];
      for (let lang of languages) {
        const checkedLang = checkLocale(supportedLocales, lang);
        if (checkedLang) {
          preferredLocale = checkedLang;
          break;
        }
      }
    }

    let cookieOptions = '';

    if (preferredLocale !== localeInCookie && cookieConfig !== 'none') {
        if (typeof cookieConfig === 'number' && Number.isInteger(cookieConfig) && cookieConfig > 0) {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + cookieConfig);
            cookieOptions = '; expires=' + expirationDate.toUTCString() + '; path=/';
        } else {
            //'session' or invalid value
            cookieOptions = '; path=/'; 
        }
        document.cookie = COOKIE_NAME + '=' + preferredLocale + cookieOptions; 
    }

    document.documentElement.lang = preferredLocale;

    window.location.replace(\`\${basePath}/\${preferredLocale}\`);

  })();
`

export default function Page() {
  return (
    <html lang={defaultLocale}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </head>
    </html>
  )
}
