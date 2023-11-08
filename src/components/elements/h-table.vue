<template>
  <table class="h__table">
    <tbody class="h__tbody">
      <tr class="h__tbody__row">
        <td
          v-for="(schedule, s_i, idx) in schedules"
          :key="s_i"
          class="h__tbody__column"
        >
          <span class="h__tbody__column--member">{{ Object.keys(schedules)[idx] }}</span>
          <div class="h__tbody__column--wrap">
            <button
              class="h__tbody__column--copy-btn"
              type="button"
              @click="copySchedule"
            ></button>
            <div
              v-for="(data, projectName, d_i) in schedule"
              :key="d_i"
              class="h__tbody__column--inner"
            >
              <span
                :class="{ total: projectName === '합계' }"
                class="h__tbody__column--project-name"
                >{{ projectName !== '합계' ? `[${projectName}]` : '합계' }}</span
              >
              <span class="h__tbody__column--time">{{ data.T ? `T: ${data.T}` : '' }}</span>
              <span class="h__tbody__column--overtime"> {{ data.OT ? `OT: ${data.OT}` : '' }}</span>
              <span
                v-for="(task, t_i) in data.tasks"
                :key="t_i"
                class="h__tbody__column--task"
                >{{ task }}</span
              >
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
  import hTableComposable, { hTableProps } from '@/composables/elements/h-table';

  const props = defineProps(hTableProps);

  const { copySchedule } = hTableComposable(props);
</script>

<style lang="scss" scoped>
  @import '@/styles/elements/h-table.scss';
</style>
