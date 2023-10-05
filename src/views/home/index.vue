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
    <div class="h__dim--error">
      <span>네트워크 오류</span>
      <button
        type="button"
        @click="handleRefresh"
      >
        새로고침
      </button>
    </div>
  </div>
  <div class="h__home">
    <div class="h__home__header">
      <h1 class="h__home__header--title">
        <figure class="h__home__header--logo">
          <img
            src="@/assets/images/logo.png"
            alt="로고"
          />
        </figure>
        FE Schedule
      </h1>
      <div class="h__home__header--content">
        <dl class="h__home__header--status">
          <span>🌐 로딩상태</span>
          <div class="wrap">
            <div>주간일정 : {{ checkStatus(fetches.getWeekSchedule) }}</div>
            <div>공유일정 : {{ checkStatus(fetches.getDetailSchedule) }}</div>
            <div>투입시간 : {{ checkStatus(fetches.weekScheduleList) }}</div>
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
          <dd>주말/새벽 일정 계산은 개발중입니다.</dd>
          <dd>버그 및 피드백은 언제나 환영합니다.</dd>
        </dl>
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
      <div class="h__home__content--footer">2023. JunTae Hahm.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import HTable from '@/components/elements/h-table.vue';
  import homeComposable from '@/composables/views/home';

  const { fetches, isLoading, isError, checkStatus, members, schedules, handleRefresh } = homeComposable();
</script>

<style scoped lang="scss">
  @import '@/styles/views/home/index.scss';
</style>
