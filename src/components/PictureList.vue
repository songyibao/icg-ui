<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <ShareModal title="分享图片" :link="shareLink" ref="shareModalRef"/>
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                style="height: 180px; object-fit: cover"
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                loading="lazy"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag color="green">
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOperation" #actions>
              <edit-outlined @click="(e) => doEdit(picture, e)" v-if="canEdit"/>
              <search-outlined @click="(e) => doSearch(picture, e)" />
              <ShareAltOutlined @click="(e) => doShare(picture, e)" />
              <delete-outlined @click="(e) => doDelete(picture, e)" v-if="canDelete"/>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { deletePictureUsingPost } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined, SearchOutlined, ShareAltOutlined} from '@ant-design/icons-vue'
import { ref } from 'vue'
import ShareModal from '@/components/ShareModal.vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOperation?: boolean
  onReload?: () => void
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOperation: false,
  onReload: () => {},
  canEdit: true,
  canDelete: true,
})
// 跳转至图片详情
const router = useRouter()
const doClickPicture = (picture) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
// 编辑
const doEdit = (picture, e) => {
  e.stopPropagation()
  router.push({
    path: '/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// 搜索
const doSearch = (picture, e) => {
  e.stopPropagation()
  router.push({
    name: 'SearchPicture',
    query: { pictureId: picture.id },
  })
}
const shareModalRef = ref()
const shareLink = ref<string>("")
const doShare = (picture,e) => {
  e.stopPropagation()
  if (!picture.id) {
    message.error('图片 ID 为空，无法分享')
    return
  }
  shareLink.value = `${window.location.origin}/picture/${picture.id}`
  shareModalRef.value?.showModal()
}

// 删除
const doDelete = async (picture, e) => {
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 让外层刷新
    props.onReload()
  } else {
    message.error('删除失败')
  }
}
</script>

<style scoped></style>
