<template>
  <div class="h__home">
    <div
      v-if="isLoading"
      class="dim-layer"
    >
      <div class="loading-animation"></div>
    </div>
    <div class="h__home__header">
      <figure class="h__home__header--logo">
        <img
          src="@/assets/images/logo.png"
          alt="로고"
        />
      </figure>
      <h1 class="h__home__header--title">FE Schedule</h1>
      <span class="h__home__header--date">{{ formatDate(startDate, 'kor') }} ~ {{ formatDate(endDate, 'kor') }}</span>
      <div class="h__home__header--status">
        <span>[업데이트 현황]</span>
        <div>주간일정 : {{ checkStatus(fetches.getWeekSchedule) }}</div>
        <div>공유일정 : {{ checkStatus(fetches.getDetailSchedule) }}</div>
        <div>투입시간 : {{ checkStatus(fetches.weekScheduleList) }}</div>
      </div>
    </div>

    <div class="h__home__content">
      <h-table
        :members="members.slice(0, 5)"
        :schedules="schedules.slice(0, 5)"
      ></h-table>
      <h-table
        :members="members.slice(5, 10)"
        :schedules="schedules.slice(5, 10)"
      ></h-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import HTable from '@/components/elements/h-table.vue';
  import homeComposable from '@/composables/views/home';
  import { formatDate } from '@/utils/date';

  const { checkStatus, fetches, isLoading, startDate, endDate, members, schedules } = homeComposable();
</script>

<style scoped lang="scss">
  @import '@/styles/views/home/index.scss';
</style>
