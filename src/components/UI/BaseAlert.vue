<template>
  <div
    class="p-4 mb-4 text-sm rounded-lg"
    :class="[
      props.textColor,
      props.bgColor,
      props.darkTextColor,
      props.darkBgColor,
    ]"
    role="alert"
  >
    <span class="font-medium">
      <slot name="title"></slot>
    </span>
    <slot>Add your custom content here! </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  textColor?: string;
  bgColor?: string;
  darkTextColor?: string;
  darkBgColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  textColor: 'text-gray-700',
  bgColor: 'bg-gray-100',
  darkTextColor: 'text-gray-300',
  darkBgColor: 'bg-gray-700',
});
</script>
