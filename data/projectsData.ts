interface Project {
  title: Record<string, string>
  description: Record<string, string>
  href?: string
  imgSrc?: string
}
// image ratio: 16 x 9
const projectsData: Project[] = [
  {
    title: { en: 'Project A', zh: '项目A', ja: 'プロジェクトA' },
    description: {
      en: 'Please edit `./data/projectsData.ts`',
      zh: '请编辑 `./data/projectsData.ts`',
      ja: '`./data/projectsData.ts` を編集してください',
    },
    href: '/',
    imgSrc: '/static/images/canada/mountains.jpg',
  },
  {
    title: { en: 'Project B', zh: '项目B', ja: 'プロジェクトB' },
    description: {
      en: 'Please edit `./data/projectsData.ts`',
      zh: '请编辑 `./data/projectsData.ts`',
      ja: '`./data/projectsData.ts` を編集してください',
    },
    href: '/',
    imgSrc: '/static/images/canada/toronto.jpg',
  },
]

export default projectsData
