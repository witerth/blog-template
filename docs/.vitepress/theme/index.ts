import BlogTheme from '@blog/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import './theme.var.css'
import 'virtual:uno.css'
import ChangeThemeDemo from './ChangeThemeDemo.vue'
import BlogRecommendArticle from '../../../src/components/BlogRecommendArticle.vue'

export default {
  ...BlogTheme,
  enhanceApp(ctx: any) {
    BlogTheme?.enhanceApp?.(ctx)
    enhanceAppWithTabs(ctx.app)
    ctx.app.component('ChangeThemeDemo', ChangeThemeDemo)
    ctx.app.component('BlogRecommendArticle', BlogRecommendArticle)
  }
}
