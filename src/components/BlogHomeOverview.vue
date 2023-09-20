<template>
  <div class="card overview-data userinfo">
    <div class="userinfo">
      <div class="userinfo-outlinks">
        <div class="flex-center mb-2 item ">
          <a href="mailto:zr906155099@gmail.com">
            <EmailIcon class=""></EmailIcon>
          </a>
        </div>
        <div class="item userinfo-profile-box">
          <a href="http://renkin.cn" title="Renkin">
            <img src="../styles/logo.png" alt="" class="userinfo-profile" />
          </a>
        </div>
        <div class="flex-center mb-2 item">
          <a href="https://github.com/rennzhang" target="_blank">
            <GithublIcon></GithublIcon>
          </a>
        </div>
      </div>
      <div class="mt-3 hr"></div>
    </div>
    <div class="flex">
      <div class="overview-item">
        <span class="count">{{ notHiddenArticles.length }}</span>
        <span class="label">博客文章</span>
      </div>
      <div class="split"></div>
      <div class="overview-item">
        <span class="count">+{{ currentMonth?.length }}</span>
        <span class="label">本月更新</span>
      </div>
      <div class="split"></div>
      <div class="overview-item">
        <span class="count">+{{ currentWeek?.length }}</span>
        <span class="label">本周更新</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import GithublIcon from "~icons/bi/github";
import EmailIcon from "~icons/clarity/email-outline-alerted";
import { computed } from "vue";
import { isCurrentWeek } from "../utils/client";
import { useArticles } from "../composables/config/blog";
import { useClipboard } from "@vueuse/core";
import { ElTooltip } from "element-plus";

const { copy, copied } = useClipboard();

const docs = useArticles();
const notHiddenArticles = computed(() => {
  return docs.value.filter((v) => !v.meta.hidden);
});
const nowMonth = new Date().getMonth();
const nowYear = new Date().getFullYear();
const currentMonth = computed(() => {
  return notHiddenArticles.value.filter((v) => {
    const pubDate = new Date(v.meta?.date);
    return pubDate?.getMonth() === nowMonth && pubDate.getFullYear() === nowYear;
  });
});

const currentWeek = computed(() => {
  return notHiddenArticles.value.filter((v) => {
    const pubDate = new Date(v.meta?.date);
    return isCurrentWeek(pubDate);
  });
});
</script>

<style lang="scss" scoped>
.userinfo {
  width: 100%;
  margin-bottom: 12px;
  .userinfo-profile-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .userinfo-profile {
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }
  }
  .userinfo-outlinks {
    display: flex;
    margin-top: 20px;
    justify-content: space-around;
    align-items: flex-end;
    .item {
      cursor: pointer;
      border-radius: 50%;
padding: 8px;
      &:hover {
        // background: var(--blog-item-tag-bg);
        // box-shadow: var(--box-shadow-hover);
        // box-shadow: 0 2px 1px 0 var(--blog-item-tag-bg), inset 0 2px 14px 0 var(--blog-item-tag-bg);



      }
    }
  }
}
.card {
  position: relative;
  margin: 0 auto 10px;
  padding: 10px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition: all 0.3s;
  display: flex;
  background-color: var(--vp-c-bg);

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
}

.overview-data {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  &.userinfo {
    flex-direction: column;
  }
}

.split {
  width: 1px;
  opacity: 0.8;
  height: 10px;
  background-color: var(--badge-font-color);
  margin-top: 8px;
}

.overview-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 0 10px;

  .count {
    font-size: 18px;
  }

  .label {
    margin-top: 6px;
    font-size: 12px;
    color: var(--description-font-color);
  }
}
</style>
