import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Event Horizon",
  description: "Knowledge Repository & Learning Materials",
  appearance: 'dark',
  outDir: './dist',
  markdown: {
    math: true
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Articles', link: '/learning-articles/' },
    ],
    sidebar: [
      {
        text: 'Learning Materials',
        items: [
          { text: 'Quantum Computing', link: '/learning-articles/quantum-computing' },
          { text: 'Mechanics (Notebook)', link: '/mechanics' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/8888/finnminn.com' }
    ]
  }
})
