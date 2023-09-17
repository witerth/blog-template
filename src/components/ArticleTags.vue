<template>
  <div>
    <span v-if="tags.length" class="tags">
      <TagIcon class="mr-1" />
      <a
        class="tag-link"
        :class="{ active: activeTag.label === tag }"
        :href="`/?tag=${tag}`"
        v-for="tag in tags"
        :key="tag"
        @click="activeTag.label = tag"
        >{{ tag }}
      </a>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { useData } from "vitepress";
import TagIcon from "~icons/solar/tag-linear";
import { useActiveTag } from "../composables/config/blog";
const { frontmatter } = useData();

const activeTag = useActiveTag();
const props = defineProps<{
  tags?: string[];
}>();
const tags = computed(() => {
  const { tags } = frontmatter.value;
  return [
    ...new Set(
      []
        .concat(tags, (props?.tags || []) as [])
        .flat()
        .filter((v) => !!v)
    ),
  ];
});
</script>

<style scoped lang="scss" src="../styles/theme/tags.scss"></style>
