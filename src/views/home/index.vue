<template>
  <div
    v-if="isLoading"
    class="dim-layer"
  >
    <div class="loading-animation"></div>
  </div>
  <h2>FE팀 일정</h2>
  {{ formatDate(startDate, 'kor') }} ~ {{ formatDate(endDate, 'kor') }}
  <table>
    <thead>
      <tr>
        <td
          v-for="(name, i) in members"
          :key="`${name}-${i}`"
        >
          {{ name }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td
          v-for="(schedule, s_i) in schedules"
          :key="`${schedule}-${s_i}`"
        >
          <div class="flex-wrap">
            <div
              v-for="(data, projectName, d_i) in schedule"
              :key="`${data}-${d_i}`"
            >
              <strong>{{ projectName }}</strong>
              <div>T: {{ data.time }}</div>
              <template
                v-if="
                  data.overTime || projectName === '[FE]' || projectName === '[전사]' || projectName === '[전사공통]'
                "
              >
                <div>{{ data.overTime > 0 ? `OT: ${data.overTime}` : '' }}</div>
                <div>
                  <span
                    v-for="(item, t_i) in data.title ? [...data.title] : []"
                    :key="`${projectName}-${t_i}`"
                  >
                    {{ item !== '' ? `- ${item}` : '' }}<br />
                  </span>
                </div>
              </template>
              <br />
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
  import homeComposable from '@/composables/views/home';
  import { formatDate } from '@/utils/date';

  const { isLoading, startDate, endDate, members, schedules } = homeComposable();
</script>

<style scoped lang="scss">
  @import '@/styles/home/index.scss';
</style>
