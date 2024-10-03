<script lang="ts" setup>
const props = defineProps(['title', 'okText'])

const emit = defineEmits(['ok', 'cancel'])

function onOk () {
  emit("ok");
}
function onCancel(){
  emit("cancel");
}
</script>

<template>
  <UModal>
    <UCard>
      <template #header>
        {{ props.title }}
      </template>
      <template #footer>
        <div style="display: flex;">
          <UButton style="margin-left: auto;" variant="soft" color="gray" @click="onCancel">取消</UButton>
          <UButton style="margin-left: 10px;" @click="onOk">{{ props.okText }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<!-- <script lang="ts" setup>
defineProps({
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['success'])

function onSuccess () {
  emit('success')
}
</script>

<template>
  <UModal>
    <UCard class="space-y-2">
      <p>This modal was opened programmatically !</p>
      <p>Count: {{ count }}</p>
      <UButton @click="onSuccess">
        Click to emit a success event
      </UButton>
    </UCard>
  </UModal>
</template> -->

