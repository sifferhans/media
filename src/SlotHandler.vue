<template>
  <component :is="tag" v-bind="$attrs">
    <span v-if="content" v-html="content"></span>
  </component>
</template>

<script>
export default {
  props: {
    value: [String, Object],
  },
  computed: {
    content() {
      return typeof this.value === 'string' ? this.value : undefined
    },
    tag() {
      return typeof this.value === 'string' ? 'div' : this.value
    },
  },
}
</script>
