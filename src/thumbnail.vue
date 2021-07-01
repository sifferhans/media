<template>
  <div class="kvass-media-thumbnail">
    <component
      :class="{ 'kvass-media-thumbnail__item--selected': value.selected }"
      class="kvass-media-thumbnail__item"
      :is="value.typeConfig.Components.Thumbnail"
      :value="value"
      v-on="$listeners"
      :style="style"
    >
    </component>
    <div class="kvass-media-thumbnail--delete" @click="$emit('delete')">
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    size: {
      type: String,
      default: '4rem',
    },
    types: {
      type: Array,
    },
    disabled: {},
  },

  computed: {
    style() {
      return {
        width: this.size,
        height: this.size,
      }
    },
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

  &--delete {
    $size: 25px;
    height: $size;
    width: $size;
    right: -$size/5;
    top: -$size/5;
    position: absolute;
    z-index: 2;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.65em;
    background-color: GetVariable('error');
    border-radius: 50%;
    cursor: pointer;
    transition: opacity 150ms ease-out, transform 150ms ease-out;

    @media (hover: hover) {
      opacity: 0;
      transform: translateY(50%);
    }
  }

  &:hover {
    .kvass-media-thumbnail--delete {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
