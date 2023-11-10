<template>
  <home :part="part"></home>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import home from '@/views/home/index.vue';
  import { computed } from 'vue';

  const route = useRoute();
  const part = computed(() => {
    return route.params.part;
  });
</script>

<style lang="scss"></style>
