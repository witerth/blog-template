import path from 'path'
import { defineConfig } from '@blog/theme/node'
import packageJSON from '../../package.json'
import { blogTheme, extraHead } from './blog-theme'
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from "unplugin-icons/resolver";
export default defineConfig({
  extends: blogTheme,
  lang: 'zh-cn',
  title: 'witerth',
  description: 'witerth的个人小站',
  head: [...extraHead],
  vite: {
    // configFile:"./vite.config.ts",
    server: {
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        '@blog/theme': path.join(__dirname, '../../src/index.ts')
      }
    },
    optimizeDeps: {
      exclude: ['vitepress-plugin-tabs']
    },
    plugins: [
      Icons(),
      UnoCSS(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ["vue", "@vueuse/core"],
        dts: "../types/auto-imports.d.ts",
        dirs: [
          "./doc/.vitepress/",
          "./src/components",
          "./src/composables",
          "./src/utils",
          "./src/types",
        ],
        vueTemplate: true,
        eslintrc: {
          enabled: true,
        },
      }),
      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: true,
        dirs: ["./src/components"],
        resolvers: [IconsResolver()],
      }),
    ],
  },
  themeConfig: {
    // footer: {
    //   message: `Powered By <a target="_blank" href="https://witerth.cn/"> witerth的个人小站@${packageJSON.version} </a>`,
    //   copyright: 'MIT License | Copyright © witerth'
    // },
    nav: [
      // {
      //   text: `v${packageJSON.version}`,
      //   link: '/changelog'
      // },
      // {
      //   text: '个人作品展示',
      //   link: '/work'
      // },
      // {
      //   text: '线上作品',
      //   items: [
      //     {
      //       text: '轻取(文件收集)',
      //       link: 'https://ep2.sugarat.top'
      //     },
      //     {
      //       text: '个人图床',
      //       link: 'https://imgbed.sugarat.top'
      //     },
      //     {
      //       text: '考勤小程序',
      //       link: 'https://hdkq.sugarat.top/'
      //     },
      //     {
      //       text: '时光恋人',
      //       link: 'https://lover.sugarat.top'
      //     },
      //     {
      //       text: '在线简历生成',
      //       link: 'https://resume.sugarat.top/'
      //     }
      //   ]
      // }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/witerth/blog-template'
      }
    ],
    editLink: {
      pattern:
        'https://github.com/witerth/blog-template/tree/main/docs/:path',
      text: '去 GitHub 上编辑内容'
    },
    lastUpdatedText: '上次更新于'
  },
  lastUpdated: true
})
