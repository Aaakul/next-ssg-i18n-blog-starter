import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { SiteConfig } from '@/data/siteConfig.mjs'

export default function NotFound() {
  return (
    <>
      <title>404</title>
      <meta name="description" content="404 Page Not Found"></meta>
      <style>{`#home-btn{margin-top:1.5rem;padding:1rem 5rem;border:none;cursor:pointer;display:inline-flex;justify-content:center;border-radius:0.5rem;color:#f3f4f6;background-color:oklch(58.8% 0.158 241.966);&:hover{@media (hover:hover){background-color:oklch(68.5% 0.169 237.323)}}}}`}</style>
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
        <button id="home-btn">
          <a
            href={`${SiteConfig.basePath}/`}
            aria-label="home"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <ArrowUturnLeftIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            <span
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: 0,
              }}
            >
              Home page
            </span>
          </a>
        </button>
      </main>
    </>
  )
}
