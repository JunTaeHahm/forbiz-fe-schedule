<template>
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
          <div
            v-for="(data, projectName, d_i) in schedule"
            :key="`${data}-${d_i}`"
          >
            <strong>{{ projectName }}</strong>
            <div>T: {{ data.time }}</div>
            <template v-if="data.overTime || projectName === '[FE]'">
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
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
  import weekScheduleComposable from '@/composables/week-schedule';
  const { members, schedules } = weekScheduleComposable();
</script>

<style scoped lang="scss">
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  thead {
    background-color: #f2f2f2;

    td {
      width: 10%;
      font-weight: bold;
      padding: 10px;
      border: 1px solid #ddd;
      text-align: center;
    }
  }

  tbody {
    td {
      padding: 8px;
      border: 1px solid #ddd;
    }
  }
</style>
