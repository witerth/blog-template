<template>
  <div class="card tags" v-if="tags.length" data-pagefind-ignore="all">
    <!-- 头部 -->
    <div class="card-header">
      <span class="title">
        <TagIcon class="mr-2"></TagIcon>
        所有标签</span
      >
      <div class="flex">
        <span
          v-if="activeTag.label"
          :type="(activeTag.type as any)"
          :effect="colorMode"
          closable
          @close="handleCloseTag"
          class="flex tag-link active"
        >
          #
          {{ activeTag.label }}
        </span>
      </div>
    </div>
    <!-- 标签列表 -->
    <ul class="tag-list">
      <li
        v-for="(item, idx) in tags"
        :key="item.tag"
        :class="{ active: activeTag.label === item.tag }"
      >
        <el-tag
          :type="tagType[idx % tagType.length]"
          @click="handleTagClick(item.tag, tagType[idx % tagType.length])"
          :effect="colorMode"
        >
          <TagBlodIcon
            v-if="activeTag.label === item.tag"
            class="mr-1"
          ></TagBlodIcon>
          {{ item.tag }}({{ item.count }})
        </el-tag>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
import { ElTag } from "element-plus";
import { useBrowserLocation, useDark } from "@vueuse/core";
import { useRoute, useRouter } from "vitepress";
import TagIcon from "~icons/solar/tag-linear";
import TagBlodIcon from "~icons/solar/tag-bold";
import {
  useActiveTag,
  useArticles,
  useCurrentPageNum,
} from "../composables/config/blog";

const docs = useArticles();
const tags = computed(() => {
  const allDocTag = docs.value
    .map((v) => v.meta.tag || [])
    .flat(Infinity) as string[];

  // 去重并统计每个标签的文章数量
  const docCountMap: any = {};
  for (const t of allDocTag) {
    docCountMap[t] = docCountMap[t] ? docCountMap[t] + 1 : 1;
  }
  return Object.entries(docCountMap).map(([k, v]) => ({ tag: k, count: v }));
});

const activeTag = useActiveTag();

const isDark = useDark({
  storageKey: "vitepress-theme-appearance",
});

const colorMode = computed(() => (isDark.value ? "light" : "dark"));

const tagType: any = ["", "info", "success", "warning", "danger"];
const currentPage = useCurrentPageNum();

const handleCloseTag = () => {
  router.go(`${window.location.origin}${router.route.path}`);
  activeTag.value.label = "";
  activeTag.value.type = "";
  currentPage.value = 1;
};

const router = useRouter();
const location = useBrowserLocation();

const handleTagClick = (tag: string, type: string) => {
  if (tag === activeTag.value.label) {
    handleCloseTag();
    return;
  }
  router.go(
    `${location.value.origin}${router.route.path}?tag=${tag}&type=${type}`
  );
  activeTag.value.type = type;
  activeTag.value.label = tag;
  currentPage.value = 1;
};
const route = useRoute();
watch(
  route,
  (val) => {
    const url = new URL(window.location.href!);
    activeTag.value.label = url.searchParams.get("tag") || "";
  },
  {
    immediate: true,
  }
);
</script>
<style scoped lang="scss" src="../styles/theme/tags.scss"></style>
<style lang="scss" scoped>
.card {
  position: relative;
  margin: 0 auto 10px;
  padding: 12px 18px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition: all 0.3s;
  background-color: rgba(var(--bg-gradient));
  display: flex;

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
}
.card-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-gutter);
  padding-bottom: 12px;
  padding-top: 4px;

  .title {
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
}

.tags {
  flex-direction: column;
}

:deep(.el-tag__content) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  transition: 0.3s all ease;

  li {
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transform: scale(0.9);
    transition: 0.3s all ease;

    &:hover,
    &.active {
      .el-tag {
        font-weight: 500;
        transform: scale(1.2);
        box-shadow: var(--box-shadow-hover);
      }
    }
  }
}
</style>
