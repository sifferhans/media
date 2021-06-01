<template>
  <div class="elder-image__uploader">
    <div>{{ value | floor }} %</div>
    <div class="elder-image__uploader-bar">
      <div class="elder-image__uploader-bar-value" :style="{ width: value + '%' }"></div>
    </div>
    <div class="elder-image__uploader-meta">
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

.elder-image__uploader {
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

  &-bar {
    flex-grow: 1;

    height: 5px;
    margin: 0 1rem;

    border-radius: GetVariable('border-radius');
    background-color: GetVariable('border-color');
  }

  &-bar-value {
    height: inherit;

    transition: width 100ms ease;

    border-radius: inherit;
    background-color: GetVariable('primary');
  }

  &-meta {
    display: flex;
    align-items: center;

    & > * + * {
      margin-left: 5px;
    }
  }
}
</style>
