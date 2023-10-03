<template>
  <div
    v-if="isLoading && !isError"
    class="h__dim"
  >
    <div class="h__dim--loading"></div>
  </div>
  <div
    v-if="isError"
    class="h__dim"
  >
    <div class="h__dim--error">네트워크 오류</div>
  </div>
  <div class="h__home">
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
        <span>✅ 업데이트 현황</span>
        <div>주간일정 : {{ checkStatus(fetches.getWeekSchedule) }}</div>
        <div>공유일정 : {{ checkStatus(fetches.getDetailSchedule) }}</div>
        <div>투입시간 : {{ checkStatus(fetches.weekScheduleList) }}</div>
      </div>
      <dl class="h__home__header--notice">
        <dt>📌 전달사항</dt>
        <dd>계산이 일치하지 않은 경우 말씀해주세요.</dd>
        <dd>주말/새벽 일정 계산은 개발중입니다.</dd>
        <dd>버그 및 피드백은 언제나 환영합니다.</dd>
      </dl>
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

    <div class="h__home__footer">2023. JunTae Hahm</div>
  </div>
</template>

<script setup lang="ts">
  import HTable from '@/components/elements/h-table.vue';
  import homeComposable from '@/composables/views/home';
  import { formatDate } from '@/utils/date';

  const { fetches, isLoading, isError, checkStatus, startDate, endDate, members, schedules } = homeComposable();
</script>

<style scoped lang="scss">
  @import '@/styles/views/home/index.scss';
</style>
