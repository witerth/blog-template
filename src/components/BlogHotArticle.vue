<template>
  <div
    class="card recommend"
    v-if="recommendList.length || empty"
    data-pagefind-ignore="all"
  >
    <!-- 头部 -->
    <div class="card-header">
      <span class="title">
        <BadgeIcon class="mr-2"></BadgeIcon>
        {{ title }}</span>
      <el-button
        v-if="showChangeBtn"
        size="small"
        type="primary"
        text
        @click="changePage"
        >{{ nextText }}</el-button
      >
    </div>
    <!-- 文章列表 -->
    <ol class="recommend-container" v-if="currentWikiData.length">
      <li v-for="(v, idx) in currentWikiData" :key="v.route">
        <!-- 序号 -->
        <i class="num">{{ idx + 1 }}</i>
        <!-- 简介 -->
        <div class="des">
          <!-- title -->
          <el-link type="info" class="title" :href="withBase(v.route)">{{
            v.meta.title
          }}</el-link>
          <!-- 描述信息 -->
          <div class="suffix">
            <!-- 日期 -->
            <span class="tag">{{ formatShowDate(v.meta.date) }}</span>
          </div>
        </div>
      </li>
    </ol>
    <div class="empty-text" v-else>{{ empty }}</div>
  </div>
</template>

<script lang="ts" setup>
import BadgeIcon from "~icons/carbon/badge"
import { ref, computed } from "vue";
import { ElButton, ElLink } from "element-plus";
import { withBase } from "vitepress";
import { useArticles, useBlogConfig } from "../composables/config/blog";
import { formatShowDate } from "../utils/client";

const { hotArticle } = useBlogConfig();
const title = computed(() => hotArticle?.title || "精选文章");
const nextText = computed(() => hotArticle?.nextText || "换一组");
const pageSize = computed(() => hotArticle?.pageSize || 9);
const empty = computed(() => hotArticle?.empty ?? "暂无精选内容");

const docs = useArticles();

const recommendList = computed(() => {
  const data = docs.value.filter((v) => v.meta.sticky);
  data.sort((a, b) => b.meta.sticky! - a.meta.sticky!);
  return [...data];
});

const currentPage = ref(1);
const changePage = () => {
  const newIdx =
    currentPage.value % Math.ceil(recommendList.value.length / pageSize.value);
  currentPage.value = newIdx + 1;
};

const currentWikiData = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize.value;
  const endIdx = startIdx + pageSize.value;
  return recommendList.value.slice(startIdx, endIdx);
});

const showChangeBtn = computed(() => {
  return recommendList.value.length > pageSize.value;
});
</script>

<style lang="scss" scoped>
.recommend-container {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0 10px 0 0px;
  width: 100%;

  li {
    display: flex;

    &:nth-child(1) .num {
      background-color: #f56c6c;
      color: #fff;
      font-size: 12px;
    }

    &:nth-child(2) .num {
      background-color: #67c23a;
      color: #fff;
      font-size: 12px;
    }

    &:nth-child(3) .num {
      background-color: var(--vp-c-brand-2);
      color: #fff;
      font-size: 12px;
    }

    .num {
      display: block;
      font-size: 14px;
      color: var(--description-font-color);
      font-weight: 600;
      margin: 6px 12px 10px 0;
      width: 18px;
      min-width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      border-radius: 6px;
    }

    .des {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .title {
      font-size: 14px;
      color: var(--vp-c-text-1);
    }
    // :deep(.el-link  .el-link__inner){
    //   // 只显示一行
    //     // 多行换行
    //     overflow: hidden;
    //   text-overflow: ellipsis;
    //   display: -webkit-box;
    //   -webkit-line-clamp: 1;
    //   -webkit-box-orient: vertical;
    // }
    .suffix {
      font-size: 12px;
      color: var(--vp-c-text-2);
    }
  }
}
</style>
