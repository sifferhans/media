<template>
  <div class="kvass-media-uploader">
    <div>{{ value | floor }} %</div>
    <div class="kvass-media-uploader__bar">
      <div class="kvass-media-uploader__bar-value" :style="{ width: value + '%' }"></div>
    </div>
    <div class="kvass-media-uploader__meta">
      <div v-if="hasMultiple">{{ current }} / {{ total }}</div>
      <div v-if="bytes">({{ size }})</div>
    </div>
  </div>
</template>

<script>
import { BytesToSize } from './utils'
export default {
  props: {
    value: Number,
    bytes: Number,
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    hasMultiple() {
      return this.total > 1
    },
    size() {
      return BytesToSize(this.bytes)
    },
  },
  filters: {
    floor: Math.floor,
  },
}
</script>

<style lang="scss">
@import './main';

.kvass-media-uploader {
  font-size: 0.7em;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  max-width: 200px;
  padding: 1rem;

  border: 1px solid GetVariable('border-color');
  border-radius: GetVariable('border-radius');
  background-color: white;

  &__bar {
    flex-grow: 1;

    height: 5px;
    margin: 0 1rem;

    border-radius: GetVariable('border-radius');
    background-color: GetVariable('border-color');
  }

  &__bar-value {
    height: inherit;

    transition: width 100ms ease;

    border-radius: inherit;
    background-color: GetVariable('primary');
  }

  &__meta {
    display: flex;
    align-items: center;

    & > * + * {
      margin-left: 5px;
    }
  }
}
</style>
