<template>
  <a class="blog-item" :href="withBase(route)">
    <!-- 标题 -->
    <p class="title" v-if="inMobile">{{ title }}</p>
    <!-- <div class="info-header">

    </div> -->
    <div class="info-container">
      <!-- 左侧信息 -->
      <div class="info-part">
        <!-- 标题 -->
        <p class="title" v-if="!inMobile">
          <span class="pin-text" v-if="!!pin">[置顶]</span>{{ title }}</p>
        <div class="blog-meta">
          <span class="split" v-if="author">
            <span class="author ">
              <img
                src="../styles/logo.png"
                alt="本文作者renkin"
                class="profile"
              />

              {{ author }}
            </span></span
          >
          <span class="split">{{ showTime }}</span>
        </div>
      <hr>

        <!-- 简短描述 -->
        <p class="description" v-if="!descriptionHTML && !!description">
          {{ description }}
        </p>
        <template v-if="descriptionHTML">
          <div class="description-html" v-html="descriptionHTML"></div>
        </template>
        <!-- 底部补充描述 -->
        <div class="badge-list" v-if="!inMobile">
          <!-- <span class="split" v-if="author">{{ author }}</span>
          <span class="split">{{ showTime }}</span> -->
          <span class="split" v-if="tags?.length">
            <ArticleTags :tags="tags"></ArticleTags>
          </span>
        </div>
      </div>
      <!-- 右侧封面图 -->
      <div
        v-if="cover"
        class="cover-img"
        :class="{ empty: !cover }"
        :style="`background-image: url(${cover});`"
      ></div>
    </div>
    <!-- 底部补充描述 -->
    <div class="badge-list" v-if="inMobile">
      <!-- <span class="split" v-if="author">{{ author }}</span>
      <span class="split">{{ showTime }}</span> -->
      <span class="split" v-if="tags?.length">
        <ArticleTags :tags="tags"></ArticleTags>
      </span>
    </div>
  </a>
</template>

<script lang="ts" setup>
import ArticleTags from "./ArticleTags.vue";
import { withBase } from "vitepress";
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import { formatShowDate } from "../utils/client";

const { width } = useWindowSize();
const inMobile = computed(() => width.value <= 500);
const props = defineProps<{
  route: string;
  title: string;
  date: string | Date;
  sticky?: number;
  description?: string;
  descriptionHTML?: string;
  tags?: string[];
  author?: string;
  cover?: string | boolean;
  pin?: number;
}>();

const showTime = computed(() => {
  return formatShowDate(props.date);
});

// function isWrappedWithPreventDefault(element: HTMLElement) {
//   let parent = element.parentElement

//   while (parent) {
//     if (parent.hasAttribute('preventDefault')) {
//       return true
//     }
//     parent = parent.parentElement
//   }

//   return false
// }
</script>

<style lang="scss" scoped>

.pin-text {
  color: #7797ff;
    font-weight: 400;
    font-family: auto;
    /* vertical-align: super; */
    font-size: 0.88em;
    margin-right: 4px;
    line-height: 24px;
}

.blog-item {
  position: relative;
  margin: 0 auto 20px;
  padding: 16px 20px;
  padding-bottom: 6px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translate(0,-4px);
    box-shadow: var(--box-shadow-hover);
    .title {
      color: var(--vp-c-brand-1);
    }
  }
}
.info-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.info-part {
  flex: 1;
}
.title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  margin-bottom: 4px;
  // 多行换行
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.blog-meta {
  font-size: 12px;
  color: var(--meta-font-color);
  padding: 2px;
  display: flex;
  align-items: center;
}
.description {
  color: var(--description-font-color);
  font-size: 14px;
  margin-top: 8px;
  // 多行换行
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  padding-left: 5px;
  color: var(--vp-c-text-2);
  min-height: 40px;
  font-family: revert;
}
.description-html {
  margin-top: 8px;
  font-size: 14px;
  padding-left: 5px;
}
.badge-list {
  font-size: 13px;
  color: var(--badge-font-color);
  margin-top: 12px;
  margin-bottom: 4px;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
}
.split {
  display: inline-flex;
  align-items: center;
}
.split:not(:last-child) {
  &::after {
    content: "";
    display: inline-block;
    width: 1px;
    height: 8px;
    margin: 0 10px;
    background-color: #4e5969;
  }
}
.cover-img {
  width: 160px;
  height: 130px;
  margin-left: 24px;
  border-radius: 2px;
  background-repeat: no-repeat;
  background-size: 160px 140px;
  &.empty {
    margin-left: 0;
    width: 0;
  }
}

@media screen and (max-width: 500px) {
  .cover-img {
    display: none;
  }
}
</style>
