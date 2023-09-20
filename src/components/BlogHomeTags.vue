<template>
  <ClientOnly>
    <div class="card blog-item-tags" v-if="tags.length" data-pagefind-ignore="all">
      <!-- 头部 -->
      <div class="card-header">
        <span class="title">
          <span v-if="activeTag.label" class="return-home-box">
            <HomeIcon class="btn" @click="handleCloseTag"></HomeIcon>
            |
          </span>
          <TagIcon class="mr-2" v-else></TagIcon>
          <span :class="{ 'ml-10': activeTag.label }">所有标签</span>
        </span>
        <a v-if="activeTag.label" @dblclick="handleCloseTag" class="tag-link active">
          <TagIcon class="mr-1" />
          {{ activeTag.label }}
        </a>
        <!-- <CloseIcon></CloseIcon> -->
      </div>
      <!-- 标签列表 -->
      <ul class="tag-list">
        <li v-for="(tag, idx) in tags" :key="tag.label">
          <el-tag
            :class="{ active: activeTag.label === tag.label }"
            :type="tagType[idx % tagType.length]"
            @click="handleTagClick(tag.label, tagType[idx % tagType.length])"
            :effect="colorMode"
          >
            <TagBlodIcon v-if="activeTag.label === tag.label" class="mr-1"></TagBlodIcon>
            {{ tag.label }}({{ tag.count }})
          </el-tag>
        </li>
      </ul>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { ElTag } from "element-plus";
import { useBrowserLocation, useDark } from "@vueuse/core";
import {  useRouter } from "vitepress";
import TagIcon from "~icons/solar/tag-linear";
import TagBlodIcon from "~icons/solar/tag-bold";
import HomeIcon from "~icons/mdi/home-import-outline";
import { useActiveTag, useArticles, useCurrentPageNum } from "../composables/config/blog";
const router = useRouter();
const location = useBrowserLocation();
const docs = useArticles();
const tags = computed(() => {
  const allDocTag = docs.value.map((v) => v.meta.tags || []).flat(Infinity) as string[];

  // 去重并统计每个标签的文章数量
  const docCountMap: any = {};
  for (const t of allDocTag) {
    docCountMap[t] = docCountMap[t] ? docCountMap[t] + 1 : 1;
  }
  return Object.entries(docCountMap).map(([k, v]) => ({ label: k, count: v }));
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

const handleTagClick = (tag: string, type: string) => {
  if (!activeTag.value.label) {
    document.querySelector("#app")!.scrollIntoView({ behavior: "smooth" });
  }
  if (tag === activeTag.value.label) {
    handleCloseTag();
    return;
  }

  // 用标签筛选文章时保留滚动位置
  window.history.replaceState(
    null,
    "",
    `${location.value.origin}${router.route.path}?tag=${tag}&type=${type}`,
  );
  activeTag.value.type = type;
  activeTag.value.label = tag;
  currentPage.value = 1;
};


</script>
<style scoped lang="scss" src="../styles/theme/tags.scss"></style>
<style lang="scss" scoped>
.return-home-box {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  left: -10px;
  top: -14px;
  padding: 9px;
  padding-top: 12px;
  &:hover {
    .btn {
      color: var(--vp-c-brand-1);
      transform: rotateY(180deg);
    }
  }
  .btn {
    font-size: 22px;
    margin-right: 4px;
    cursor: pointer;
    transition: 0.8s all ease;
  }
  @media (max-width: 768px) {
    .btn {
      color: var(--vp-c-brand-1);
      transform: rotateY(180deg);
    }
  }
}
.blog-item-tags {
  flex-direction: column;
  flex-wrap: wrap;
}

:deep(.el-tag__content) {
  transition: 0.4s all ease;
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
    margin-right: 6px;
    margin-bottom: 6px;
    cursor: pointer;
    // transform: scale(0.9);
    transition: 0.3s all ease;
    font-weight: 500;
    :deep(.el-tag) {
      transition: 0.4s all ease;

      &.active,
      &:hover {
        transform: translate(0, -4px);
        box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
