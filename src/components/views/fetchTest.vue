<template>
  <div>
    <button @click="fetchData()">Fetch Data</button>
    <div v-if="data">
      <pre>{{ data }}</pre>
    </div>
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import useFetchData from '@/components/composables/fetchTest';

  const { data, error, fetchData } = useFetchData();
</script>

<style scoped lang="scss">
  .error {
    color: red;
  }
</style>
