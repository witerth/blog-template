---
hidden: true
description: 介绍Vitepress内置常用能力
title: VitePress - 常用能力
tags:
 - 博客配置
group:
 title: 博客配置
readingTime: false
recommend: 9
prev:
  text: '🔧 主题配置 - 样式配置'
  link: './style'
---

# 文章配置
介绍常用的一些 官方默认主题 提供的能力:
* https://vitepress.dev/guide/markdown
* https://vitepress.dev/reference/site-config

## outline
* Type: `number | [number, number] | 'deep' | false`
* Default: `2`

设置文章自动生成的目录，和 [config.themeConfig.outline](https://vitepress.dev/reference/default-theme-config#outline) 表现一样，文章里单独设置的优先级更高

```md
---
# 取二三级标题生成目录
outline: [2,3]
---
```

![](https://img.cdn.sugarat.top/mdImg/MTY3NzE2MzY5MzMyMA==677163693320)
