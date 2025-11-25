import { jsx, jsxs, Fragment } from 'react/jsx-runtime'
import { useIsClient } from 'foxact/use-is-client'
import { ComposeContextProvider } from 'foxact/compose-context-provider'
import {
  memo,
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useMemo,
  useRef,
  forwardRef,
} from 'react'
import { useEffect as useEffect$1 } from 'foxact/use-abortable-effect'
import { createContextState } from 'foxact/context-state'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { nullthrow } from 'foxact/nullthrow'
import { identity } from 'foxts/identity'
import { pickOne } from 'foxts/pick-random'
import { useComponentWillReceiveUpdate } from 'foxact/use-component-will-receive-update'
import { useSingleton } from 'foxact/use-singleton'

function _define_property(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else obj[key] = value

  return obj
}

function _object_spread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    var ownKeys = Object.keys(source)

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable
        })
      )
    }

    ownKeys.forEach(function (key) {
      _define_property(target, key, source[key])
    })
  }

  return target
}

function ownKeys(object, _enumerableOnly) {
  var keys = Object.keys(object)

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    keys.push.apply(keys, symbols)
  }

  return keys
}
function _object_spread_props(target, source) {
  source = source != null ? source : {}

  if (Object.getOwnPropertyDescriptors)
    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
  else {
    ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
    })
  }

  return target
}

function _object_without_properties_loose(source, excluded) {
  if (source == null) return {}

  var target = {}
  var sourceKeys = Object.keys(source)
  var key, i

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i]
    if (excluded.indexOf(key) >= 0) continue
    target[key] = source[key]
  }

  return target
}

function _object_without_properties(source, excluded) {
  if (source == null) return {}

  var target = _object_without_properties_loose(source, excluded)
  var key, i

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source)
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i]
      if (excluded.indexOf(key) >= 0) continue
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue
      target[key] = source[key]
    }
  }

  return target
}

const DisqusJSFooter = /*#__PURE__*/ memo(() =>
  /*#__PURE__*/ jsx('footer', {
    className: 'dsqjs-footer-container',
    children: /*#__PURE__*/ jsxs('p', {
      className: 'dsqjs-footer',
      children: [
        'Powered by ',
        /*#__PURE__*/ jsx('a', {
          className: 'dsqjs-disqus-logo',
          href: 'https://disqus.com',
          target: '_blank',
          rel: 'external nofollow noopener noreferrer',
          'aria-label': 'disqus.com',
        }),
        '. ',
        'Made with',
        ' ',
        /*#__PURE__*/ jsx('a', {
          className: 'dsqjs-dsqjs-logo',
          href: 'https://disqusjs.skk.moe',
          target: '_blank',
          rel: 'external nofollow noopener noreferrer',
          'aria-label': 'disqusjs.skk.moe',
          children: 'DisqusJS',
        }),
      ],
    }),
  })
)
if (process.env.NODE_ENV !== 'production') {
  DisqusJSFooter.displayName = 'DisqusJSFooter'
}

var styles = { dsqjs: 'dsqjs' }

const [MessageProvider, useMessage, useSetMessage] = createContextState(null)

var try_full_disqus_mode$2 = '尝试使用完整 Disqus 模式'
var force_full_disqus_mode$2 = '始终启用完整 Disqus 模式'
var cannot_access_disqus_prefix$2 = '可能无法连接到 Disqus，已切换至基础模式。'
var empty_comments$2 = '暂无评论'
var basic_mode$2 = '基础评论模式'
var basic_mode_load_failed$2 = '评论加载失败，请稍后重试'
var retry$2 = '重新尝试'
var thread_not_created_prefix$2 = '当前话题尚未创建。开始讨论请：'
var switch_to_full_disqus_mode$2 = '切换至完整 Disqus 模式'
var comment_deleted$2 = '该评论已被删除'
var show_more_replies$2 = ' 查看更多回复'
var load_failed_retry$2 = '加载失败，请重新尝试'
var loading_comments$2 = '正在加载评论，请稍候...'
var load_more_comments$2 = '加载更多评论'
var comments$2 = '条评论'
var zhMessages = {
  try_full_disqus_mode: try_full_disqus_mode$2,
  force_full_disqus_mode: force_full_disqus_mode$2,
  cannot_access_disqus_prefix: cannot_access_disqus_prefix$2,
  empty_comments: empty_comments$2,
  basic_mode: basic_mode$2,
  basic_mode_load_failed: basic_mode_load_failed$2,
  retry: retry$2,
  thread_not_created_prefix: thread_not_created_prefix$2,
  switch_to_full_disqus_mode: switch_to_full_disqus_mode$2,
  comment_deleted: comment_deleted$2,
  show_more_replies: show_more_replies$2,
  load_failed_retry: load_failed_retry$2,
  loading_comments: loading_comments$2,
  load_more_comments: load_more_comments$2,
  comments: comments$2,
}

var try_full_disqus_mode$1 = 'Try enabling Full Disqus Mode'
var force_full_disqus_mode$1 = 'Always enable Full Disqus Mode'
var cannot_access_disqus_prefix$1 = 'Unable to connect to Disqus. Basic comment mode is active.'
var empty_comments$1 = 'No comments yet'
var basic_mode$1 = 'Basic Comment Mode'
var basic_mode_load_failed$1 = 'Unable to load comments. Please try again later.'
var retry$1 = 'Try Again'
var thread_not_created_prefix$1 = 'This thread has not been created yet. To initiate a discussion:'
var switch_to_full_disqus_mode$1 = 'Switch to Full Disqus Mode'
var comment_deleted$1 = 'This comment has been removed'
var show_more_replies$1 = ' View more replies'
var load_failed_retry$1 = 'Loading failed, please try again'
var loading_comments$1 = 'Loading comments, please wait...'
var load_more_comments$1 = 'Load additional comments'
var comments$1 = 'Comment(s)'
var enMessages = {
  try_full_disqus_mode: try_full_disqus_mode$1,
  force_full_disqus_mode: force_full_disqus_mode$1,
  cannot_access_disqus_prefix: cannot_access_disqus_prefix$1,
  empty_comments: empty_comments$1,
  basic_mode: basic_mode$1,
  basic_mode_load_failed: basic_mode_load_failed$1,
  retry: retry$1,
  thread_not_created_prefix: thread_not_created_prefix$1,
  switch_to_full_disqus_mode: switch_to_full_disqus_mode$1,
  comment_deleted: comment_deleted$1,
  show_more_replies: show_more_replies$1,
  load_failed_retry: load_failed_retry$1,
  loading_comments: loading_comments$1,
  load_more_comments: load_more_comments$1,
  comments: comments$1,
}

var try_full_disqus_mode = '完全な Disqus モードを試します'
var force_full_disqus_mode = '完全な Disqus モードを常に使用します'
var cannot_access_disqus_prefix =
  'Disqus にアクセスできない可能性があります。基本モードを有効にしました。'
var empty_comments = 'コメントはありません'
var basic_mode = '基本コメントモード'
var basic_mode_load_failed = 'コメントの読み込みに失敗しました'
var retry = '再試行します'
var thread_not_created_prefix = '現在のスレッドは作成されていません。議論を始めるには：'
var switch_to_full_disqus_mode = '完全な Disqus モードに切り替えます'
var comment_deleted = 'このコメントは削除されました'
var show_more_replies = ' より多くの返信を表示します'
var load_failed_retry = '読み込みに失敗しました。再試行してください'
var loading_comments = 'コメントを読み込んでいます...'
var load_more_comments = 'さらにコメントを読み込みます'
var comments = '件のコメント'
var jaMessages = {
  try_full_disqus_mode: try_full_disqus_mode,
  force_full_disqus_mode: force_full_disqus_mode,
  cannot_access_disqus_prefix: cannot_access_disqus_prefix,
  empty_comments: empty_comments,
  basic_mode: basic_mode,
  basic_mode_load_failed: basic_mode_load_failed,
  retry: retry,
  thread_not_created_prefix: thread_not_created_prefix,
  switch_to_full_disqus_mode: switch_to_full_disqus_mode,
  comment_deleted: comment_deleted,
  show_more_replies: show_more_replies,
  load_failed_retry: load_failed_retry,
  loading_comments: loading_comments,
  load_more_comments: load_more_comments,
  comments: comments,
}

const messages = {
  zh: zhMessages,
  en: enMessages,
  ja: jaMessages,
}
function getLanguage() {
  if (typeof window === 'undefined') {
    return 'zh'
  }
  const lang = document.documentElement.lang || navigator.language
  if (lang.startsWith('ja')) {
    return 'ja'
  }
  if (lang.startsWith('en')) {
    return 'en'
  }
  return 'zh'
}
function t(key) {
  const currentLanguage = getLanguage()
  return messages[currentLanguage][key] || messages.zh[key] || key
}

const THREAD_ID = 'disqus_thread'
const EMBED_SCRIPT_ID = 'dsq-embed-scr'
function getDefaultPageUrl() {
  return document.location.origin + document.location.pathname + document.location.search
}
function applyPageConfig(config, url, onReady) {
  if (config.identifier) {
    this.page.identifier = config.identifier
  }
  this.page.url = url
  if (config.title) {
    this.page.title = config.title
  }
  this.callbacks.onReady = [onReady]
}
function loadDisqusInstance(config, onReady) {
  if (typeof window === 'undefined') return
  var _config_url
  const resolvedUrl =
    (_config_url = config.url) !== null && _config_url !== void 0
      ? _config_url
      : getDefaultPageUrl()
  if (window.DISQUS && document.getElementById(EMBED_SCRIPT_ID)) {
    window.DISQUS.reset({
      reload: true,
      config() {
        applyPageConfig.call(this, config, resolvedUrl, onReady)
      },
    })
    return
  }
  window.disqus_config = function disqusConfig() {
    applyPageConfig.call(this, config, resolvedUrl, onReady)
    this.language = (document.documentElement.lang || navigator.language).replace('-', '_')
  }
  window.disqus_shortname = config.shortname
  const scriptEl = document.createElement('script')
  scriptEl.id = EMBED_SCRIPT_ID
  scriptEl.src = `https://${config.shortname}.disqus.com/embed.js`
  scriptEl.async = true
  document.head.appendChild(scriptEl)
}
function clearDisqusInstance() {
  var _document_getElementById, _window_DISQUS, _document_getElementById1
  if (typeof window === 'undefined') return
  window.disqus_config = undefined
  ;(_document_getElementById = document.getElementById(EMBED_SCRIPT_ID)) === null ||
  _document_getElementById === void 0
    ? void 0
    : _document_getElementById.remove()
  ;(_window_DISQUS = window.DISQUS) === null || _window_DISQUS === void 0
    ? void 0
    : _window_DISQUS.reset({})
  try {
    delete window.DISQUS
  } catch (_e) {
    window.DISQUS = undefined
  }
  ;(_document_getElementById1 = document.getElementById(THREAD_ID)) === null ||
  _document_getElementById1 === void 0
    ? void 0
    : _document_getElementById1.replaceChildren()
  document
    .querySelectorAll(
      'link[href*="disquscdn.com/next"], link[href*="disqus.com/next"], script[src*="disquscdn.com/next/embed"], script[src*="disqus.com/count-data.js"], iframe[title="Disqus"]'
    )
    .forEach((el) => el.remove())
}
const Disqus = /*#__PURE__*/ memo(({ shortname, identifier, url, title }) => {
  const setMsg = useSetMessage()
  const [loaded, setLoaded] = useState(false)
  useIsomorphicLayoutEffect(() => setMsg(null))
  useEffect(() => {
    if (window.disqus_shortname !== shortname) {
      clearDisqusInstance()
    }
    loadDisqusInstance(
      {
        shortname,
        identifier,
        url,
        title,
      },
      () => setLoaded(true)
    )
    return clearDisqusInstance
  }, [shortname, identifier, url, title])
  return /*#__PURE__*/ jsxs(Fragment, {
    children: [
      /*#__PURE__*/ jsx('div', {
        id: THREAD_ID,
        children: t('loading_comments'),
      }),
      !loaded &&
        /*#__PURE__*/ jsx('div', {
          id: 'dsqjs-msg',
          'aria-busy': 'true',
          children: t('loading_comments'),
        }),
    ],
  })
})
if (process.env.NODE_ENV !== 'production') {
  Disqus.displayName = 'Disqus'
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg)
    var value = info.value
  } catch (error) {
    reject(error)
    return
  }
  if (info.done) resolve(value)
  else Promise.resolve(value).then(_next, _throw)
}
function _async_to_generator(fn) {
  return function () {
    var self = this,
      args = arguments

    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args)

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
      }

      _next(undefined)
    })
  }
}

function getDisqusJsModeDefaultValue() {
  if (typeof window !== 'undefined') {
    const value = sessionStorage.getItem('dsqjs_mode')
    if (value === 'dsqjs' || value === 'disqus') {
      return value
    }
  }
  return null
}
const [ModeProvider, useMode, useSetModeState] = createContextState(getDisqusJsModeDefaultValue())
function useSetMode() {
  const setDisqusJsMode = useSetModeState()
  return useCallback(
    (mode) => {
      setDisqusJsMode(mode)
      void Promise.resolve().then(() => {
        if (mode === null) {
          sessionStorage.removeItem('dsqjs_mode')
        } else {
          sessionStorage.setItem('dsqjs_mode', mode)
        }
      })
    },
    [setDisqusJsMode]
  )
}

const [HasErrorProvider, useHasError, useSetHasError] = createContextState(false)

const DisqusJSLoadMoreCommentsButton = /*#__PURE__*/ memo((_param) => {
  var { isError, isLoading } = _param,
    restProps = _object_without_properties(_param, ['isError', 'isLoading'])
  const text = isError
    ? t('load_failed_retry')
    : isLoading
      ? t('loading_comments')
      : t('load_more_comments')
  return /*#__PURE__*/ jsx(
    'a',
    _object_spread_props(_object_spread({}, restProps), {
      id: 'dsqjs-load-more',
      className: `dsqjs-load-more ${isError ? 'is-error' : ''}`,
      role: 'button',
      children: text,
    })
  )
})
if (process.env.NODE_ENV !== 'production') {
  DisqusJSLoadMoreCommentsButton.displayName = 'DisqusJSLoadMoreCommentsButton'
}
function createModeButton(id, mode, displayName) {
  const Component = /*#__PURE__*/ memo(({ children }) => {
    const setMode = useSetMode()
    return /*#__PURE__*/ jsx('a', {
      id: id,
      className: 'dsqjs-msg-btn',
      onClick: () => setMode(mode),
      role: 'button',
      children: children,
    })
  })
  if (process.env.NODE_ENV !== 'production') {
    Component.displayName = displayName
  }
  return Component
}
const DisqusJSForceDisqusModeButton = createModeButton(
  'dsqjs-force-disqus',
  'disqus',
  'DisqusJSForceDisqusModeButton'
)
const DisqusJSReTestModeButton = createModeButton(
  'dsqjs-test-disqus',
  null,
  'DisqusJSRetestModeButton'
)
createModeButton('dsqjs-force-dsqjs', 'dsqjs', 'DisqusJSForceDisqusJsModeButton')
const DisqusJSRetryButton = /*#__PURE__*/ memo(({ children }) => {
  const setDisqusJsHasError = useSetHasError()
  return /*#__PURE__*/ jsx('a', {
    id: 'dsqjs-reload-dsqjs',
    className: 'dsqjs-msg-btn',
    onClick: () => setDisqusJsHasError(false),
    role: 'button',
    children: children,
  })
})
if (process.env.NODE_ENV !== 'production') {
  DisqusJSRetryButton.displayName = 'DisqusJSRetryButton'
}

const DisqusJSError = /*#__PURE__*/ memo(() =>
  /*#__PURE__*/ jsxs('div', {
    id: 'dsqjs-msg',
    children: [
      t('basic_mode_load_failed'),
      /*#__PURE__*/ jsx('br', {}),
      /*#__PURE__*/ jsx(DisqusJSRetryButton, {
        children: t('retry'),
      }),
      ' | ',
      /*#__PURE__*/ jsx(DisqusJSReTestModeButton, {
        children: t('try_full_disqus_mode'),
      }),
    ],
  })
)
const DisqusJSCreateThread = /*#__PURE__*/ memo(() =>
  /*#__PURE__*/ jsxs('div', {
    id: 'dsqjs-msg',
    children: [
      /*#__PURE__*/ jsx('br', {}),
      /*#__PURE__*/ jsx('span', {
        children: t('thread_not_created_prefix'),
      }),
      /*#__PURE__*/ jsx('br', {}),
      /*#__PURE__*/ jsx(DisqusJSForceDisqusModeButton, {
        children: t('switch_to_full_disqus_mode'),
      }),
    ],
  })
)
const DisqusJSNoComment = /*#__PURE__*/ memo(({ text }) =>
  /*#__PURE__*/ jsx('p', {
    className: 'dsqjs-no-comment',
    children: text,
  })
)
if (process.env.NODE_ENV !== 'production') {
  DisqusJSError.displayName = 'DisqusJSError'
  DisqusJSCreateThread.displayName = 'DisqusJSCreateThread'
  DisqusJSNoComment.displayName = 'DisqusJSNoComment'
}

function disqusJsApiFetcher(apiKey, url) {
  const Url = new URL(url)
  Url.searchParams.set('api_key', apiKey)
  return fetch(Url.href).then((res) => res.json())
}
const getTimeStampFromString = (dateString) => new Date(dateString).getTime()
let domParser = null
function replaceDisqusCdn(str) {
  return str.replaceAll('a.disquscdn.com', 'c.disquscdn.com')
}
function processCommentMessage(str) {
  const rawHtml = replaceDisqusCdn(str).replaceAll(
    /https?:\/\/disq.us\/url\?url=(.+)%3A[\w-]+&amp;cuid=\d+/g,
    (_, $1) => decodeURIComponent($1)
  )
  domParser || (domParser = new DOMParser())
  const doc = domParser.parseFromString(rawHtml, 'text/html')
  // Very basic, but it will do.
  // Any attempt to bypass XSS limitation will be blocked by Disqus' WAF.
  doc
    .querySelectorAll('script, iframe, object, embed, form, input, meta')
    .forEach((e) => e.remove())
  doc.querySelectorAll('a').forEach((a) => {
    // Sanitize href to prevent javascript: or data: URLs
    if (a.href.startsWith('javascript:') || a.href.startsWith('data:')) {
      a.remove()
    } else {
      a.target = '_blank'
      a.rel = 'external noopener nofollow noreferrer'
    }
  })
  // Remove event handler attributes (e.g., onclick, onload)
  doc.querySelectorAll('*').forEach((el) => {
    for (let i = 0, len = el.attributes.length; i < len; i++) {
      const attr = el.attributes[i]
      // Remove event handler attributes (e.g., onclick, onload)
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
    }
    // Remove inline styles (optional, to prevent potential javascript: in styles)
    if (el.hasAttribute('style')) {
      el.removeAttribute('style')
    }
  })
  return doc.body.innerHTML
}
const timezoneOffset = new Date().getTimezoneOffset()
const numberPadstart = (num) => String(num).padStart(2, '0')
function formatDate(str) {
  const utcTimestamp = getTimeStampFromString(str)
  const date = new Date(utcTimestamp - timezoneOffset * 60 * 1000)
  return `${date.getFullYear()}-${numberPadstart(date.getMonth() + 1)}-${numberPadstart(date.getDate())} ${numberPadstart(date.getHours())}:${numberPadstart(date.getMinutes())}`
}
function checkDomainAccessibility(domain) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const timeout = setTimeout(() => {
      clear()
      reject()
    }, 3000)
    function handleLoad() {
      clearTimeout(timeout)
      clear()
      resolve()
    }
    function handleError() {
      clearTimeout(timeout)
      clear()
      reject()
    }
    function clear() {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
      img.remove()
    }
    img.addEventListener('error', handleError)
    img.addEventListener('load', handleLoad)
    img.src = `https://${domain}/favicon.ico?${Date.now()}=${Date.now()}`
  })
}

const ConfigContext = createContext(null)
const ConfigProvider = ConfigContext.Provider
function useConfig() {
  return nullthrow(useContext(ConfigContext), '<ConfigProvider /> is missing')
}

function DisqusJSPostItem({ comment, children, nesting }) {
  const { admin, adminLabel, disqusJsModeAssetsUrlTransformer = identity } = useConfig()
  const profileUrl = comment.author.profileUrl
  const avatarUrl = disqusJsModeAssetsUrlTransformer(replaceDisqusCdn(comment.author.avatar.cache))
  const avatar = /*#__PURE__*/ jsx('img', {
    alt: comment.author.username,
    src: avatarUrl,
  })
  const author = profileUrl
    ? /*#__PURE__*/ jsx('span', {
        className: 'dsqjs-post-author',
        children: /*#__PURE__*/ jsx('a', {
          href: profileUrl,
          target: '_blank',
          rel: 'noreferrer noopener nofollow external',
          children: comment.author.name,
        }),
      })
    : /*#__PURE__*/ jsx('span', {
        className: 'dsqjs-post-author',
        children: comment.author.name,
      })
  return /*#__PURE__*/ jsxs('li', {
    id: `comment-${comment.id}`,
    children: [
      /*#__PURE__*/ jsxs('div', {
        className: 'dsqjs-post-item dsqjs-clearfix',
        children: [
          /*#__PURE__*/ jsx('div', {
            className: 'dsqjs-post-avatar',
            children: profileUrl
              ? /*#__PURE__*/ jsx('a', {
                  href: profileUrl,
                  target: '_blank',
                  rel: 'noreferrer noopener nofollow external',
                  children: avatar,
                })
              : avatar,
          }),
          /*#__PURE__*/ jsxs('div', {
            className: 'dsqjs-post-body',
            children: [
              /*#__PURE__*/ jsxs('div', {
                className: 'dsqjs-post-header',
                children: [
                  author,
                  admin === comment.author.username &&
                    /*#__PURE__*/ jsx('span', {
                      className: 'dsqjs-admin-badge',
                      children: adminLabel,
                    }),
                  ' ',
                  /*#__PURE__*/ jsx('span', {
                    className: 'dsqjs-bullet',
                  }),
                  ' ',
                  comment.createdAt &&
                    /*#__PURE__*/ jsx('span', {
                      className: 'dsqjs-meta',
                      children: /*#__PURE__*/ jsx('time', {
                        children: formatDate(comment.createdAt),
                      }),
                    }),
                ],
              }),
              comment.isDeleted
                ? /*#__PURE__*/ jsx('div', {
                    className: 'dsqjs-post-content',
                    children: /*#__PURE__*/ jsx('small', {
                      children: t('comment_deleted'),
                    }),
                  })
                : /*#__PURE__*/ jsx('div', {
                    className: 'dsqjs-post-content',
                    dangerouslySetInnerHTML: {
                      __html: processCommentMessage(comment.message),
                    },
                  }),
            ],
          }),
        ],
      }),
      /*#__PURE__*/ jsx(DisqusJSChildrenPostItems, {
        nesting: nesting,
        children: children,
      }),
      comment.hasMore &&
        /*#__PURE__*/ jsxs('p', {
          className: 'dsqjs-has-more',
          children: [
            /*#__PURE__*/ jsx(DisqusJSForceDisqusModeButton, {
              children: t('switch_to_full_disqus_mode'),
            }),
            ' ',
            t('show_more_replies'),
          ],
        }),
    ],
  })
}
function DisqusJSChildrenPostItems({ children, nesting: currentNesting = 1 }) {
  const { nesting: nestingSetting = 4 } = useConfig()
  if (!children || children.length === 0) return null
  return /*#__PURE__*/ jsx('ul', {
    className: `dsqjs-post-list ${currentNesting < nestingSetting ? 'dsqjs-children' : ''}`,
    children: children.map((comment) =>
      /*#__PURE__*/ jsx(DisqusJSPostItem, _object_spread({}, comment), comment.comment.id)
    ),
  })
}
function DisqusJSCommentsList({ comments }) {
  const processedComments = useMemo(() => {
    const topLevelComments = []
    const childComments = []
    comments
      .map((comment, i) => ({
        i,
        p: comment.parent,
        d: getTimeStampFromString(comment.createdAt),
      }))
      .sort((a, b) => (a.p && b.p ? a.d - b.d : 0))
      .forEach(({ i }) => {
        ;(comments[i].parent ? childComments : topLevelComments).push(comments[i])
      })
    const childrenMap = new Map()
    childComments.forEach((comment) => {
      const parentId = Number(comment.parent)
      const list = childrenMap.get(parentId)
      if (list) {
        list.unshift(comment)
      } else {
        childrenMap.set(parentId, [comment])
      }
    })
    const toAst = (comment, nesting) => {
      const nextNesting = nesting + 1
      const children = childrenMap.get(Number(comment.id))
      return {
        comment,
        children: children ? children.map((child) => toAst(child, nextNesting)) : null,
        nesting: nextNesting,
      }
    }
    return topLevelComments.map((comment) => toAst(comment, 0))
  }, [comments])
  return /*#__PURE__*/ jsx('ul', {
    className: 'dsqjs-post-list',
    id: 'dsqjs-post-container',
    children: processedComments.map((comment) =>
      /*#__PURE__*/ jsx(DisqusJSPostItem, _object_spread({}, comment), comment.comment.id)
    ),
  })
}

// We will try to make the used api key as stable as possible
// And if React decides to forget some memoized values, it doesn't matter anyway
function useRandomApiKey(apiKeys) {
  return useMemo(() => {
    if (Array.isArray(apiKeys)) {
      return pickOne(apiKeys)
    }
    return apiKeys
  }, [apiKeys])
}

function getDisqusJsSortTypeDefaultValue() {
  if (typeof window !== 'undefined') {
    const value = sessionStorage.getItem('dsqjs_sort')
    if (value === 'popular' || value === 'asc' || value === 'desc') {
      return value
    }
  }
  return null
}
const [SortTypeProvider, useSortType, useSetSortType] = createContextState(
  getDisqusJsSortTypeDefaultValue()
)

function DisqusJSSortTypeRadio({ sortType, onChange, checked, title, label }) {
  return /*#__PURE__*/ jsxs(Fragment, {
    children: [
      /*#__PURE__*/ jsx('input', {
        className: 'dsqjs-order-radio',
        id: `dsqjs-order-${sortType}`,
        type: 'radio',
        name: 'comment-order',
        value: sortType,
        onChange: onChange,
        checked: checked,
      }),
      /*#__PURE__*/ jsx('label', {
        className: 'dsqjs-order-label',
        htmlFor: `dsqjs-order-${sortType}`,
        title: title,
        children: label,
      }),
    ],
  })
}
const sortOptions = [
  {
    value: 'desc',
    title: '按从新到旧',
    label: '最新',
  },
  {
    value: 'asc',
    title: '按从旧到新',
    label: '最早',
  },
  {
    value: 'popular',
    title: '按评分从高到低',
    label: '最佳',
  },
]
const DisqusJSSortTypeRadioGroup = /*#__PURE__*/ memo(() => {
  const sortType = useSortType()
  const setSortType = useSetSortType()
  const current = sortType !== null && sortType !== void 0 ? sortType : 'desc'
  return /*#__PURE__*/ jsx('div', {
    className: 'dsqjs-order',
    children: sortOptions.map(({ value, title, label }) =>
      /*#__PURE__*/ jsx(
        DisqusJSSortTypeRadio,
        {
          checked: current === value,
          sortType: value,
          title: title,
          label: label,
          onChange: () => setSortType(value),
        },
        value
      )
    ),
  })
})
if (process.env.NODE_ENV !== 'production') {
  DisqusJSSortTypeRadioGroup.displayName = 'DisqusJSSortTypeRadio'
}
const DisqusJSHeader = /*#__PURE__*/ memo(({ totalComments, siteName }) =>
  /*#__PURE__*/ jsx('header', {
    className: 'dsqjs-header',
    id: 'dsqjs-header',
    children: /*#__PURE__*/ jsxs('nav', {
      className: 'dsqjs-nav dsqjs-clearfix',
      children: [
        /*#__PURE__*/ jsxs('ul', {
          children: [
            /*#__PURE__*/ jsx('li', {
              className: 'dsqjs-nav-tab dsqjs-tab-active',
              children: /*#__PURE__*/ jsxs('span', {
                children: [totalComments, ' ', t('comments')],
              }),
            }),
            /*#__PURE__*/ jsx('li', {
              className: 'dsqjs-nav-tab',
              children: siteName,
            }),
          ],
        }),
        /*#__PURE__*/ jsx(DisqusJSSortTypeRadioGroup, {}),
      ],
    }),
  })
)
if (process.env.NODE_ENV !== 'production') {
  DisqusJSHeader.displayName = 'DisqusJSHeader'
}
function DisqusJSPosts({ id }) {
  const { apikey, shortname, api } = useConfig()
  const apiKey = useRef(useRandomApiKey(apikey))
  const [posts, setPosts] = useState([])
  const setError = useSetHasError()
  const sortType = useSortType()
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false)
  const [errorWhenLoadingMorePosts, setErrorWhenLoadingMorePosts] = useState(false)
  const fetchMorePosts = useCallback(
    (reset = false) =>
      _async_to_generator(function* () {
        if (!id) return
        const lastPost = reset ? null : posts[posts.length - 1]
        if (lastPost && !lastPost.cursor.hasNext) return
        setIsLoadingMorePosts(true)
        setErrorWhenLoadingMorePosts(false)
        const cursor =
          posts.length !== 0 &&
          (lastPost === null || lastPost === void 0 ? void 0 : lastPost.cursor.next)
            ? `&cursor=${encodeURIComponent(lastPost.cursor.next)}`
            : ''
        const url = `${api}3.0/threads/listPostsThreaded?forum=${shortname}&thread=${id}&order=${sortType !== null && sortType !== void 0 ? sortType : 'desc'}${cursor}`
        const fail = () => {
          if (reset) {
            setError(true)
          } else {
            setErrorWhenLoadingMorePosts(true)
          }
          setIsLoadingMorePosts(false)
        }
        try {
          const newPosts = yield disqusJsApiFetcher(apiKey.current, url)
          if (newPosts.code === 0) {
            setPosts((prevPosts) => (reset ? [] : prevPosts).concat(newPosts))
            setIsLoadingMorePosts(false)
          } else {
            fail()
          }
        } catch (_e) {
          fail()
        }
      })(),
    [id, posts, api, shortname, sortType, setError]
  )
  const resetAndFetchFirstPageOfPosts = useCallback(() => fetchMorePosts(true), [fetchMorePosts])
  const fetchNextPageOfPosts = useCallback(() => fetchMorePosts(false), [fetchMorePosts])
  useComponentWillReceiveUpdate(resetAndFetchFirstPageOfPosts, [id, sortType])
  useSingleton(resetAndFetchFirstPageOfPosts)
  const comments = useMemo(() => posts.filter(Boolean).flatMap((i) => i.response), [posts])
  if (posts.length > 0) {
    var _posts_
    return /*#__PURE__*/ jsxs(Fragment, {
      children: [
        /*#__PURE__*/ jsx(DisqusJSCommentsList, {
          comments: comments,
        }),
        ((_posts_ = posts[posts.length - 1]) === null || _posts_ === void 0
          ? void 0
          : _posts_.cursor.hasNext) &&
          /*#__PURE__*/ jsx(DisqusJSLoadMoreCommentsButton, {
            isLoading: isLoadingMorePosts,
            isError: errorWhenLoadingMorePosts,
            onClick: isLoadingMorePosts ? undefined : fetchNextPageOfPosts,
          }),
      ],
    })
  }
  return null
}
function DisqusJSThread() {
  const {
    apikey: $apikey,
    identifier: $identifier,
    shortname,
    api,
    siteName,
    nocomment,
  } = useConfig()
  const apiKey = useRef(useRandomApiKey($apikey))
  const [thread, setThread] = useState(null)
  const setError = useSetHasError()
  const identifier =
    typeof window === 'undefined'
      ? $identifier !== null && $identifier !== void 0
        ? $identifier
        : null
      : $identifier !== null && $identifier !== void 0
        ? $identifier
        : document.location.origin + document.location.pathname + document.location.search
  const fetchThread = useCallback(
    () =>
      _async_to_generator(function* () {
        try {
          const thread = yield disqusJsApiFetcher(
            apiKey.current,
            `${api}3.0/threads/list.json?forum=${encodeURIComponent(shortname)}&thread=${encodeURIComponent(`ident:${identifier}`)}`
          )
          if (thread.code === 0) {
            setThread(thread)
          } else {
            setError(true)
          }
        } catch (_e) {
          setError(true)
        }
      })(),
    [api, apiKey, identifier, setError, setThread, shortname]
  )
  const setMsg = useSetMessage()
  const fetchThreadRef = useRef(null)
  useEffect(() => {
    const actionElement = /*#__PURE__*/ jsxs(Fragment, {
      children: [
        /*#__PURE__*/ jsx(DisqusJSReTestModeButton, {
          children: t('try_full_disqus_mode'),
        }),
        ' | ',
        /*#__PURE__*/ jsx(DisqusJSForceDisqusModeButton, {
          children: t('force_full_disqus_mode'),
        }),
      ],
    })
    if (fetchThreadRef.current === identifier) {
      setMsg(
        /*#__PURE__*/ jsxs(Fragment, {
          children: [t('cannot_access_disqus_prefix'), /*#__PURE__*/ jsx('br', {}), actionElement],
        })
      )
    } else {
      setMsg(
        /*#__PURE__*/ jsxs(Fragment, {
          children: [t('loading_comments'), ' ', actionElement],
        })
      )
      fetchThreadRef.current = identifier
      void fetchThread()
    }
  }, [fetchThread, identifier, setMsg])
  useEffect(() => {
    if (thread) {
      setMsg(null)
    }
  }, [thread, setMsg])
  if (!thread) {
    return null
  }
  if (thread.response.length !== 1) {
    return /*#__PURE__*/ jsx(DisqusJSCreateThread, {})
  }
  const matchedThread = thread.response[0]
  const totalComments = matchedThread.posts
  return /*#__PURE__*/ jsxs(Fragment, {
    children: [
      /*#__PURE__*/ jsx(DisqusJSHeader, {
        totalComments: totalComments,
        siteName: siteName !== null && siteName !== void 0 ? siteName : '',
      }),
      totalComments === 0
        ? /*#__PURE__*/ jsx(DisqusJSNoComment, {
            text: nocomment !== null && nocomment !== void 0 ? nocomment : t('empty_comments'),
          })
        : /*#__PURE__*/ jsx(DisqusJSPosts, {
            id: matchedThread.id,
          }),
    ],
  })
}

function DisqusJSEntry() {
  const mode = useMode()
  const setMode = useSetMode()
  const { shortname, identifier, url, title } = useConfig()
  useEffect$1(
    (signal) => {
      if (mode === 'disqus' || mode === 'dsqjs') {
        return
      }
      Promise.all(['disqus.com', `${shortname}.disqus.com`].map(checkDomainAccessibility))
        .then(() => {
          if (!signal.aborted) {
            setMode('disqus')
          }
        })
        .catch(() => {
          if (!signal.aborted) {
            setMode('dsqjs')
          }
        })
    },
    [mode, setMode, shortname]
  )
  const disqusJsHasError = useHasError()
  const msg = useMessage()
  if (disqusJsHasError) {
    return /*#__PURE__*/ jsx(DisqusJSError, {})
  }
  return /*#__PURE__*/ jsxs(Fragment, {
    children: [
      msg != null &&
        /*#__PURE__*/ jsx('div', {
          id: 'dsqjs-msg',
          children: msg,
        }),
      mode === 'disqus' &&
        /*#__PURE__*/ jsx(Disqus, {
          shortname: shortname,
          identifier: identifier,
          url: url,
          title: title,
        }),
      mode === 'dsqjs' && /*#__PURE__*/ jsx(DisqusJSThread, {}),
    ],
  })
}

var index = /*#__PURE__*/ forwardRef(function DisqusJS(_param, ref) {
  var {
      shortname,
      siteName,
      identifier,
      url,
      title,
      api,
      apikey,
      nesting,
      nocomment,
      admin,
      adminLabel,
      className,
      disqusJsModeAssetsUrlTransformer,
    } = _param,
    rest = _object_without_properties(_param, [
      'shortname',
      'siteName',
      'identifier',
      'url',
      'title',
      'api',
      'apikey',
      'nesting',
      'nocomment',
      'admin',
      'adminLabel',
      'className',
      'disqusJsModeAssetsUrlTransformer',
    ])
  const contexts = useMemo(
    () => [
      /*#__PURE__*/ jsx(
        ConfigProvider,
        {
          value: {
            shortname,
            siteName,
            identifier,
            url,
            title,
            api,
            apikey,
            nesting,
            nocomment,
            admin,
            adminLabel,
            disqusJsModeAssetsUrlTransformer,
          },
        },
        'config'
      ),
      /*#__PURE__*/ jsx(ModeProvider, {}, 'mode'),
      /*#__PURE__*/ jsx(SortTypeProvider, {}, 'sortType'),
      /*#__PURE__*/ jsx(HasErrorProvider, {}, 'hasError'),
      /*#__PURE__*/ jsx(MessageProvider, {}, 'msg'),
    ],
    [
      admin,
      adminLabel,
      api,
      apikey,
      disqusJsModeAssetsUrlTransformer,
      identifier,
      nesting,
      nocomment,
      shortname,
      siteName,
      title,
      url,
    ]
  )
  if (useIsClient()) {
    return /*#__PURE__*/ jsx(
      'div',
      _object_spread_props(
        _object_spread(
          {
            ref: ref,
          },
          rest
        ),
        {
          className: `${styles.dsqjs} ${className !== null && className !== void 0 ? className : ''}`,
          children: /*#__PURE__*/ jsx(ComposeContextProvider, {
            contexts: contexts,
            children: /*#__PURE__*/ jsxs('section', {
              id: 'dsqjs',
              children: [
                /*#__PURE__*/ jsx(DisqusJSEntry, {}),
                /*#__PURE__*/ jsx(DisqusJSFooter, {}),
              ],
            }),
          }),
        }
      )
    )
  }
  return null
})

export { index as default }
