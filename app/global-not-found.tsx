import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { SiteConfig } from '@/data/siteConfig.mjs'

export default function GlobalNotFound() {
  const dataURL = `data:image/svg+xml,%3Csvg width='64' height='64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m48.57278,54.45143l-24.8279,0l-8.31766,-9.88113l0,-0.06254l33.14557,0l0,9.94367zm-22.76412,-9.94367l-10.38144,0l0,-34.95919l10.38144,0l0,34.95919z' fill='%230ea5e9'/%3E%3C/svg%3E`
  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning lang={SiteConfig.defaultLocale}>
      <head>
        <title>404</title>
        <meta name="description" content="404 Page Not Found"></meta>
        <link
          rel="apple-touch-icon"
          type="image/png"
          href={`${SiteConfig.basePath}/apple-icon.png`}
          sizes="180x180"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href={`${SiteConfig.basePath}/favicon.ico`}
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="180x180"
          href={`${SiteConfig.basePath}/apple-icon.png`}
        />
        <link rel="icon" type="image/svg+xml" sizes="any" href={dataURL} />
        <link rel="mask-icon" type="image/svg+xml" href={dataURL} color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <style>{`body{background-color:#f5f5f5}@media (prefers-color-scheme:dark){body{background-color:#030712;color:#f3f4f6}}#home-btn{margin-top:1.5rem;padding:1rem 5rem;border:none;cursor:pointer;display:inline-flex;justify-content:center;border-radius:0.5rem;color:#f3f4f6;background-color:oklch(58.8% 0.158 241.966)}#home-btn:hover{background-color:oklch(68.5% 0.169 237.323)}`}</style>
      </head>
      <body>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '100%',
              maxWidth: '768px',
            }}
          >
            <section style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
              <h1
                style={{
                  textAlign: 'center',
                  fontSize: '3.75rem',
                  fontWeight: 'bold',
                }}
                aria-label="Page not found"
              >
                404
              </h1>
            </section>
            <div
              style={{ marginTop: '1rem', marginBottom: '2rem', width: '100%', textAlign: 'left' }}
            >
              <p>
                We're sorry, but the page you're trying to access might not exist, has been removed,
                or is not yet available in a localized version.
              </p>
              <p>非常抱歉，您尝试访问的页面可能不存在、已被移除或尚未提供本地化版本。</p>
              <p>
                申し訳ありませんが、お探しのページは存在しないか、削除されたか、またはまだローカライズ版が用意されていません。
              </p>
            </div>
          </div>
          <a
            role="button"
            id="home-btn"
            href={`${SiteConfig.basePath}/`}
            aria-label="Back to Home"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <ArrowUturnLeftIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          </a>
        </main>
      </body>
    </html>
  )
}
