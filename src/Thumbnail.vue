<template>
  <div class="kvass-media-thumbnail">
    <component
      :class="{ 'kvass-media-thumbnail__item--selected': value.selected }"
      class="kvass-media-thumbnail__item"
      :is="value.typeConfig.components.Thumbnail"
      :value="value"
      v-on="$listeners"
      :style="style"
    >
    </component>

    <Actions :value="value" :disabled="disabled" @delete="$emit('delete', value)" />
  </div>
</template>

<script>
import Actions from './ThumbnailActions.vue'

export default {
  props: {
    value: Object,
    size: {
      type: String,
      default: '4rem',
    },
    types: Array,
    disabled: Boolean,
  },
  computed: {
    style() {
      return {
        width: this.size,
        height: this.size,
      }
    },
  },
  components: {
    Actions,
  },
}
</script>

<style lang="scss">
@import './main';

.kvass-media-thumbnail {
  position: relative;

  &__item {
    background-color: GetVariable('input-color');
    cursor: pointer;
    border: 1px solid GetVariable('border-color');
    border-radius: GetVariable('border-radius');

    &--selected {
      border-color: GetVariable('primary');
      box-shadow: 0 3px 10px -2px rgba(black, 0.3);
    }
  }

  @media (hover: hover) {
    &:hover .kvass-media-thumbnail-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
