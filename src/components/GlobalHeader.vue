<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" />
</template>
<script lang="ts" setup>
import { h, ref } from 'vue';
import { HomeOutlined,InfoCircleOutlined} from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
const current = ref<string[]>(['mail']);
const items = ref<MenuProps['items']>([
  {
    key: 'home',
    icon: () => h(HomeOutlined),
    label: 'Navigation One',
    title: 'Navigation One',
  },
  {
    key: 'about',
    icon: () => h(InfoCircleOutlined),
    label: 'Navigation Two',
    title: 'Navigation Two',
  }
]);
</script>

