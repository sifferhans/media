<template>
  <div class="kvass-media-droparea-wrapper">
    <div
      class="kvass-media-droparea"
      :class="{
        'kvass-media-droparea--active': isDragOver,
        'kvass-media-droparea--invalid': !isValidDragOver,
        'kvass-media-droparea--selected': selected,
      }"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onLeave"
    >
      <slot name="preview" />

      <div v-if="!isDisabled" class="kvass-media-droparea__instruction">
        <input
          v-if="canUpload"
          :type="type"
          :accept="accept"
          :required="isRequired"
          ref="input"
          @change="onChange"
          :disabled="!canUpload"
          :multiple="multiple"
          class="kvass-media-droparea__input"
        />
        <template v-if="isValidDragOver">
          <slot name="drop-message" v-if="!isDisabled">
            <SlotHandler :value="dropMessage" />
          </slot>
          <slot />
        </template>

        <FontAwesomeIcon v-else icon="ban" size="lg" />

        <slot name="custom-message" />
      </div>

      <Actions
        v-if="!multiple && selected"
        :value="selected"
        :disabled="isDisabled"
        @delete="$emit('remove', selected)"
      />
    </div>
    <Uploader
      v-if="queue.total"
      :value="queue.progress"
      :bytes="queue.bytes"
      :current="queue.counter"
      :total="queue.total"
    ></Uploader>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { AttributeBoolean, Clone, IsAccepted } from './utils'
import { Options } from '../index'
import Uploader from './Uploader'
import SlotHandler from './SlotHandler'
import Actions from './ThumbnailActions.vue'

const QueueTemplate = {
  counter: 0,
  total: 0,
  progress: 0,
  bytes: 0,
  result: [],
}
export default {
  props: {
    value: [Array, Object, String],
    multiple: Boolean,
    sortable: {
      type: Boolean,
      default: true,
    },
    upload: Function,
    serialize: Function,
    size: {
      type: String,
      default: 'cover',
    },
    placement: {
      type: String,
      enum: ['outside', 'inside'],
    },
    uploadOptions: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'file',
    },
    accept: {
      type: String,
      default: 'image/*',
    },
    selected: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isDragOver: false,
      isValidDragOver: true,
      queue: Clone(QueueTemplate),
    }
  },

  computed: {
    isRequired() {
      if (!AttributeBoolean('required').call(this) || this.value) return false
      return true
    },
    isDisabled: AttributeBoolean('disabled'),
    serializeComp() {
      return this.serialize || Options.serialize
    },
    dropMessage() {
      return Options.dropMessage
    },
    uploadComp() {
      return this.upload || Options.upload
    },

    canUpload() {
      return !this.isDisabled && !this.queue.total
    },
  },
  methods: {
    run(files) {
      files = Array.from(files).filter((f) => IsAccepted(f, this.accept))
      this.queue.total = files.length
      this.queue.counter = 0
      this.queue.bytes = files.reduce((res, cur) => (res += cur.size), 0)
      let progress = files.map(() => 0)
      Promise.all(
        files.map((file, index) => {
          return this.uploadComp(
            file,
            (val) => {
              progress[index] = val
              this.queue.progress = progress.reduce((r, c) => (r += c), 0) / progress.length
            },
            this.uploadOptions,
          ).then((res) => {
            this.queue.counter++
            return res
          })
        }),
      ).then((result) => {
        if (!result || !result.length) return
        result = result.flat()
        let value = this.value || []
        this.$emit('input', this.multiple ? [...value, ...result] : result[0])
        this.resetQueue()
        if (!this.selected || !this.multiple) this.$nextTick(() => this.$emit('select'))
      })
    },

    onChange(e) {
      if (this.isDisabled) return
      this.run(e.target.files)
      this.$refs.input.value = null
    },
    onDrop(e) {
      if (this.isDisabled) return
      e.preventDefault()
      this.onLeave()
      if (this.isReadonly || !e.dataTransfer.files.length) return
      this.$refs.input.files = e.dataTransfer.files
      this.$refs.input.dispatchEvent(new InputEvent('input'))
      this.run(e.dataTransfer.files)
    },
    onDragOver(e) {
      if (this.isDisabled) return
      this.isValidDragOver = Array.from(e.dataTransfer.items).every((e) => IsAccepted(e, this.accept))
      this.isDragOver = true
      e.preventDefault()
    },
    onLeave() {
      this.isValidDragOver = true
      this.isDragOver = false
    },
    resetQueue() {
      this.queue = Clone(QueueTemplate)
    },
  },

  components: {
    Uploader,
    FontAwesomeIcon,
    SlotHandler,
    Actions,
  },
}
</script>

<style lang="scss">
@import './main';

.kvass-media-droparea {
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
  text-align: center;
  border: 2px dashed GetVariable('border-color');
  border-radius: GetVariable('border-radius');
  background-color: GetVariable('input-color');
  background-repeat: no-repeat;
  background-position: center;
  flex-grow: 1;
  min-height: 150px;
  height: 100%;
  flex-direction: column;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    opacity: 0;
    background-color: GetVariable('primary');
  }

  @media (hover: hover) {
    &:hover .kvass-media-thumbnail-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-wrapper {
    flex-grow: 1;

    &[disabled='disabled'] {
      cursor: not-allowed;
    }
  }

  &--active {
    border-color: GetVariable('primary');

    &:before {
      opacity: 0.15;
    }

    iframe {
      display: none;
    }
  }

  &--invalid {
    cursor: not-allowed;
    color: GetVariable('error');
    border-color: GetVariable('error');
    background-image: none !important;

    &:before {
      opacity: 0.2;
      background-color: GetVariable('error');
    }

    .kvass-media-droparea__instruction {
      background: transparent !important;
    }

    iframe {
      display: none;
    }
  }

  &__instruction {
    position: absolute;
    max-width: 75ch;
    font-size: 0.9em;
    transition: opacity 250ms ease;
    text-align: center;
    z-index: 1;

    @media (hover: hover) {
      .kvass-media-droparea--selected & {
        padding: 1rem;
        opacity: 0;
        border-radius: GetVariable('border-radius');
        background-color: rgba(white, 0.7);
        backdrop-filter: blur(8px);
      }
    }

    .kvass-media-droparea:hover &,
    .kvass-media-droparea--active & {
      opacity: 1;
    }
  }
  &__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;

    &[type='text'] {
      z-index: -1;
      pointer-events: none;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  b {
    color: GetVariable('primary');
  }

  .kvass-media-uploader {
    margin-top: 1rem;

    .kvass-media--inside & {
      position: absolute;
      top: 0;
      right: 0;
      margin-top: 2rem;
      margin-right: 2rem;
    }
  }
}
</style>
