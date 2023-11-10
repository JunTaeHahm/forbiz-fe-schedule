<template>
  <div
    v-if="isLoading"
    class="h__dim"
  >
    <div class="h__dim--loading"></div>
  </div>
  <!-- <div
    v-if="isError"
    class="h__dim"
  ></div> -->
  <div class="h__home">
    <div class="h__home__header">
      <h1 class="h__home__header--title">
        <figure class="h__home__header--logo">
          <img
            src="@/assets/images/logo.png"
            alt="로고"
          />
        </figure>
        {{ (part as string).toUpperCase() }} Schedule
      </h1>

      <div class="h__home__header--week">
        <div class="h__home__header--week--date">
          {{ `${startDate.slice(2, 11)} (월) - ${endDate.slice(2, 11)} (금)` }}
        </div>
        <div class="btns">
          <button
            class="h__home__header--week--button"
            type="button"
            @click="handleWeek('pre')"
          >
            <span>지난주</span>
          </button>
          <button
            class="h__home__header--week--button"
            type="button"
            @click="handleWeek('cur')"
          >
            <span>현재</span>
          </button>
          <button
            class="h__home__header--week--button"
            type="button"
            @click="handleWeek('nex')"
          >
            <span>다음주</span>
          </button>
        </div>
      </div>

      <div class="h__home__header--content">
        <dl class="h__home__header--status">
          <span>🌐 로딩상태</span>
          <div class="wrap">
            <div>{{ checkStatus(fetches.getWeekSchedule) }}</div>
          </div>
        </dl>
        <dl class="h__home__header--notice">
          <dt>⚠️ 주의사항</dt>
          <dd>휴가(연차/반차/시차)도 일정에 작성해야 합니다.</dd>
          <dd>일 8시간, 주 40시간 일정을 모두 작성해야 계산이 정확합니다.</dd>
          <dd>위 사항은 공휴일은 제외됩니다.</dd>
        </dl>
        <dl class="h__home__header--notice">
          <dt>📌 전달사항</dt>
          <dd>계산이 일치하지 않은 경우 말씀해주세요.</dd>
          <dd>버그 및 피드백은 언제나 환영합니다.</dd>
        </dl>
      </div>
    </div>

    <div class="h__home__content">
      <h-table :schedules="scheduleList"></h-table>
      <div class="h__home__content--footer">2023. JunTae Hahm.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import HTable from '@/components/elements/h-table.vue';
  import homeComposable, { homeProps } from '@/composables/views/home';

  const props = defineProps(homeProps);

  const {
    startDate,
    endDate,

    fetches,
    isLoading,
    checkStatus,

    scheduleList,
    handleWeek,
  } = homeComposable(props);
</script>

<style scoped lang="scss">
  @import '@/styles/views/home/index.scss';
</style>
