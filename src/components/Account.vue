<script lang="ts" setup>
import QRcode from '@/components/QRCode.vue'

const props = defineProps<{
  user: IUser
}>()

const { currentUser, userList, currentMedal } = storeToRefs(useAppStore())
const { refreshCurrentUser } = useAppStore()

const isDefault = computed(() => currentUser.value?.mid === props.user?.mid)

const qrcodeShow = ref(false)

function handleAddNew() {
  qrcodeShow.value = true
}

function handleSuccessLogin() {
  qrcodeShow.value = false
  refreshCurrentUser()
}

function setMaster() {
  currentUser.value = props.user
  currentMedal.value = undefined
  refreshCurrentUser()
}

function handleExit() {
  const idx = userList.value.findIndex(user => user.mid === props.user.mid)
  userList.value.splice(idx, 1)

  // 如果退出的是当前账号
  if (isDefault.value) {
    currentUser.value = undefined
    currentMedal.value = undefined
  }
}
</script>

<template>
  <el-card
    shadow="hover" class="relative h-46 w-40 center"
  >
    <el-tooltip content="退出登录">
      <el-button v-if="user.mid" class="absolute right-0 top-0 border-none! text-red!" plain @click="handleExit">
        <span class="i-carbon-close-outline text-lg" />
      </el-button>
    </el-tooltip>
    <div v-if="user?.mid" class="column_center">
      <el-avatar :src="user.face" :size="60" />
      <el-tag v-if="isDefault" type="danger" class="mt-2">
        当前账号
      </el-tag>
      <span class="mt-5 text-sm">{{ user.uname }}</span>
      <span class="text-xs text-coolgray">{{ user.mid }}</span>
      <el-button v-if="!isDefault" :type="isDefault ? 'danger' : 'primary'" plain class="mt-2" @click="setMaster">
        使用该账号
      </el-button>
    </div>
    <div v-else>
      <QRcode v-if="qrcodeShow" @success="handleSuccessLogin" />
      <el-tooltip
        v-else
        effect="dark"
        content="点击登录账号"
        placement="top"
      >
        <el-button plain circle class="border-none!" @click="handleAddNew">
          <span class="i-carbon-add-alt text-5xl" />
        </el-button>
      </el-tooltip>
    </div>
  </el-card>
</template>
