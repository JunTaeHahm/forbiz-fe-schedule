<template>
  <table class="h__table">
    <thead class="h__thead">
      <tr class="h__thead__row">
        <td
          v-for="(name, i) in members"
          :key="i"
          class="h__thead__column"
        >
          <span class="h__thead__column--member">{{ name }}</span>
        </td>
      </tr>
    </thead>

    <tbody class="h__tbody">
      <tr class="h__tbody__row">
        <td
          v-for="(schedule, s_i) in schedules"
          :key="s_i"
          class="h__tbody__column"
        >
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
              <span class="h__tbody__column--project-name">{{ projectName }}</span>
              <span class="h__tbody__column--time">T: {{ data.time }}</span>

              <template v-if="shouldShowTitle(projectName, data)">
                <span class="h__tbody__column--overtime">{{ data.overTime > 0 ? `OT: ${data.overTime}` : '' }}</span>
                <ul>
                  <li
                    v-for="(item, t_i) in data.title"
                    :key="t_i"
                    class="h__tbody__column--title"
                  >
                    {{ item !== '' ? `${item}` : '' }}
                  </li>
                </ul>
              </template>
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

  const { members, schedules, copySchedule, shouldShowTitle } = hTableComposable(props);
</script>

<style lang="scss" scoped>
  @import '@/styles/elements/h-table.scss';
</style>
