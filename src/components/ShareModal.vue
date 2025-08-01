<template>
  <a-modal v-model:open="visible" title="分享">
    <template #footer>
      <a-button type="primary" @click="handleOk">完成</a-button>
    </template>
    <a-flex vertical>
      <span>复制链接🔗</span>
      <a-typography-link copyable>
        {{ props.link }}
      </a-typography-link>
    </a-flex>
    <a-flex vertical>
      <span>扫码查看</span>
      <a-qrcode :value="props.link" :size="256" />
    </a-flex>

  </a-modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
// 定义组件属性类型
interface Props {
  title: string;
  link: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '送一包',
  link: 'http://songyb.top',
})

const visible = ref<boolean>(false);
// 定义组件props

const showModal = () => {
  visible.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  visible.value = false;
};

defineExpose({
  showModal,
})
</script>

