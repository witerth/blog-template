<script setup lang="ts" name="BlogApp">
import Theme from "vitepress/theme";
import BlogHomeInfo from "./BlogHomeInfo.vue";
import BlogHomeBanner from "./BlogHomeBanner.vue";
import BlogList from "./BlogList.vue";
import BlogComment from "./BlogComment.vue";
import BlogSearch from "./BlogSearch.vue";
import BlogSidebar from "./BlogSidebar.vue";
import BlogImagePreview from "./BlogImagePreview.vue";
import BlogArticleAnalyze from "./BlogArticleAnalyze.vue";
import BlogAlert from "./BlogAlert.vue";
import BlogPopover from "./BlogPopover.vue";
import BlogHomeTags from "./BlogHomeTags.vue";
import { useBlogThemeMode, useActiveTag } from "../composables/config/blog";
import { useRoute } from "vitepress";
const activeTag = useActiveTag();
const isBlogTheme = useBlogThemeMode();
const { Layout } = Theme;

const route = useRoute();
const updateActiveTag = () => {
  const url = new URL(window.location.href!);
  activeTag.value.label = url?.searchParams.get("tag") || "";
};

// 解决点击title回到首页，但是tag还在的问题
const goHome = () => {
  activeTag.value.label = "";
};

onMounted(updateActiveTag);
watch(route, () => {
  console.group("Renkin blog log: [route changed]");
  console.log("content:", route);
  console.groupEnd();
  updateActiveTag();
});
</script>

<template>
  <Layout class="renkin-theme">
    <template #layout-top>
      <BlogAlert />
      <BlogPopover />
    </template>

    <template #doc-before>
      <slot name="doc-before" />
      <!-- 阅读时间分析 -->
      <ClientOnly>
        <BlogArticleAnalyze />
      </ClientOnly>
      <!-- 图片预览 -->
      <BlogImagePreview />
    </template>
    <!-- 自定义搜索，替代Algolia，未来择机移除 -->
    <template #nav-bar-content-before>
      <slot name="nav-bar-content-before" />
      <BlogSearch />
    </template>
    <!-- 自定义首页 -->
    <template #home-hero-before v-if="isBlogTheme">
      <slot name="home-hero-before" />
      <div class="home">
        <div class="header-banner">
          <BlogHomeBanner />
        </div>
        <div class="content-wrapper">
          <div class="blog-list-wrapper">
            <div class="transition-all tags-container" v-if="activeTag.label">
              <BlogHomeTags></BlogHomeTags>
            </div>
            <BlogList />
          </div>
          <div class="blog-info-wrapper"><BlogHomeInfo /></div>
        </div>
      </div>
    </template>
    <template #sidebar-nav-after v-if="isBlogTheme">
      <slot name="sidebar-nav-after" />
      <BlogSidebar />
    </template>
    <!-- 评论 -->
    <template #doc-after>
      <slot name="doc-after" />
      <BlogComment />
    </template>

    <!-- 透传默认主题的其它插槽 -->
    <!-- navbar -->
    <template #nav-bar-title-before>
      <slot name="nav-bar-title-before" />
      <span class="title-router-control" @click="goHome"></span>
    </template>
    <template #nav-bar-title-after>
      <slot name="nav-bar-title-after" />
      <span class="title-after-text">的扯淡日记</span>
    </template>
    <template #nav-bar-content-after><slot name="nav-bar-content-after" /></template>
    <template #nav-screen-content-before><slot name="nav-screen-content-before" /></template>
    <template #nav-screen-content-after><slot name="nav-screen-content-after" /></template>

    <!-- sidebar -->
    <template #sidebar-nav-before><slot name="sidebar-nav-before" /></template>

    <!-- content -->
    <template #page-top><slot name="page-top" /></template>
    <template #page-bottom><slot name="page-bottom" /></template>

    <template #not-found><slot name="not-found" /></template>
    <template #home-hero-info><slot name="home-hero-info" /></template>
    <template #home-hero-image><slot name="home-hero-image" /></template>
    <template #home-hero-after><slot name="home-hero-after" /></template>
    <template #home-features-before><slot name="home-features-before" /></template>
    <template #home-features-after><slot name="home-features-after" /></template>

    <template #doc-footer-before><slot name="doc-footer-before" /></template>

    <template #doc-top><slot name="doc-top" /></template>
    <template #doc-bottom><slot name="doc-bottom" /></template>

    <template #aside-top><slot name="aside-top" /></template>
    <template #aside-bottom><slot name="aside-bottom" /></template>
    <template #aside-outline-before><slot name="aside-outline-before" /></template>
    <template #aside-outline-after><slot name="aside-outline-after" /></template>
    <template #aside-ads-before><slot name="aside-ads-before" /></template>
    <template #aside-ads-after><slot name="aside-ads-after" /></template>
  </Layout>
</template>
<style scoped lang="scss">
.home {
  margin: 0 auto;
  padding: 20px;
  max-width: 1280px;
}

@media screen and (min-width: 960px) {
  .home {
    padding-top: var(--vp-nav-height);
  }
}

.header-banner {
  width: 100%;
  padding: 60px 0;
}

.content-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  :deep(.card),
  :deep(.blog-item) {
    background: var(--vp-c-bg);
  }
}

.blog-list-wrapper {
  width: 100%;
}
.blog-info-wrapper {
  margin-left: 16px;
  position: sticky;
  top: 100px;
}

@media screen and (max-width: 959px) {
  .blog-info-wrapper {
    margin-left: 16px;
    position: sticky;
    top: 40px;
  }
}

@media screen and (max-width: 767px) {
  .content-wrapper {
    flex-wrap: wrap;
  }

  .blog-info-wrapper {
    margin: 20px 0;
    width: 100%;
  }
}
:deep(.VPNavBar) {
  .title {
    position: relative;
  }
  .title-router-control {
    content: " ";
    width: 100%;
    top: 0;
    z-index: 1;
    position: absolute;
    height: 100%;
  }
}

.VPNavBar:not(.top),
.VPNavBar.has-sidebar {
  .title-after-text {
    transition: 0.7s all ease;

    // visibility: visible;
    // display: inline-block;
    margin-left: 4px;
    width: auto;
  }
  // @media (max-width: 549px) {
  //   .title-after-text {
  //     visibility: hidden;
  //   }
  // }
}
.title-after-text {
  // visibility: hidden;
  width: 0;
  overflow: hidden;
  transition: 0.3s all ease;
  // display: none;
}
</style>
