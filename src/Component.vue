<template>
  <div class="elder-image" :class="['elder-image--' + placement]">
    <label v-if="label" :for="id" class="elder-image__label">
      {{ label }}
      <span v-if="isRequired" class="elder-image__label-required">*</span>
    </label>
    <!-- <InputComponent label="Velg media type">
      <select v-model="mediaType" class="elder-input__element">
        <option v-for="option in mediaOptions" v-bind:value="option.value" :key="option.value">
          {{ option.label }}
        </option>
      </select>
    </InputComponent> -->
    <!-- <Type :type="mediaType" /> -->
    <MediaOption />
    <div
      class="elder-image__droparea"
      :class="dropareaClass"
      :style="dropareaStyle"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onLeave"
    >
      <input
        type="file"
        accept="image/*"
        :required="isRequired"
        ref="input"
        @change="onChange"
        :disabled="!canUpload"
        :multiple="multiple"
      />
      <div v-if="canUpload" class="elder-image__droparea-instruction">
        <slot v-if="isValidDragOver" name="drop-message">
          <SlotHandler :value="dropMessage" />
        </slot>

        <FontAwesomeIcon v-else icon="ban" size="lg" />
      </div>
      <div v-if="!multiple && selected && !isDisabled" class="elder-image__thumbnail-delete" @click="remove(selected)">
        <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
      </div>
    </div>

    <Draggable v-if="multiple" v-model="thumbnails" :disabled="!sortable || isDisabled" class="elder-image__thumbnails">
      <thumbnail
        v-for="(item, index) in thumbnails"
        :key="index"
        :selected="selected === item"
        :value="serializeComp(item)"
        @click="selected = item"
        @delete="remove(item)"
      />
    </Draggable>
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
import { AttributeBoolean, Clone, IsAccepted } from './utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { Options } from '../index'
import Uploader from './uploader'
import Thumbnail from './thumbnail'
import Draggable from 'vuedraggable'
import SlotHandler from './SlotHandler'
import MediaOption from './Option'

import './icons'

const QueueTemplate = {
  counter: 0,
  total: 0,
  progress: 0,
  bytes: 0,
  result: [],
}

/* Value format
{
  url: '...',
  type: '...'
}
------------ */

export default {
  props: {
    value: [Array, Object, String],
    label: String,
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
  },
  provide() {
    return {
      disabled: this.isDisabled,
    }
  },
  data() {
    return {
      id: null,
      selected: null,
      isDragOver: false,
      isValidDragOver: true,
      queue: Clone(QueueTemplate),
      mediaType: 'image',
    }
  },
  watch: {
    value: {
      handler(val) {
        if (!this.selected) this.select()
      },
      immediate: true,
    },
  },
  computed: {
    mediaOptions() {
      return [
        { label: 'Bilde', value: 'image' },
        {
          label: 'Video',
          value: 'video',
        },
      ]
    },
    isRequired() {
      if (!AttributeBoolean('required').call(this) || this.value) return false
      return true
    },
    isDisabled: AttributeBoolean('disabled'),
    dropareaClass() {
      return {
        'elder-image__droparea--active': this.isDragOver,
        'elder-image__droparea--invalid': !this.isValidDragOver,
        'elder-image__droparea--selected': this.selected,
      }
    },
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
    thumbnails: {
      get() {
        if (!this.value) return []
        return this.value instanceof Array ? this.value : [this.value]
      },
      set(val) {
        if (!this.multiple) return
        this.$emit('input', val)
      },
    },
    dropareaStyle() {
      if (!this.selected) return {}
      return {
        backgroundImage: `url(${this.serializeComp(this.selected).url})`,
        backgroundSize: this.size,
        backgroundOrigin: this.size === 'contain' ? 'content-box' : undefined,
        borderStyle: 'solid',
        borderWidth: '1px',
      }
    },
  },
  methods: {
    changeType() {
      console.log('tes')
    },
    run(files) {
      files = Array.from(files).filter((f) => IsAccepted(f, 'image/*'))

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
        if (!this.selected || !this.multiple) this.$nextTick(() => this.select())
      })
    },
    remove(item) {
      this.$emit('input', this.multiple ? this.value.filter((v) => v !== item) : null)
      if (this.selected === item) this.$nextTick(() => this.select())
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

      this.isValidDragOver = Array.from(e.dataTransfer.items).every((e) => IsAccepted(e, 'image/*'))
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
    select(val) {
      if (!this.value) return (this.selected = null)
      if (this.multiple && !this.value.length) return (this.selected = null)
      if (val) return (this.selected = val)

      return (this.selected = this.multiple ? this.value[0] : this.value)
    },
  },
  created() {
    this.id = this._uid
  },
  components: {
    Uploader,
    Thumbnail,
    Draggable,
    FontAwesomeIcon,
    SlotHandler,
    MediaOption,
  },
}
</script>

<style lang="scss">
@import './main';

.elder-image {
  position: relative;

  display: flex;
  flex-direction: column;

  text-align: left;

  &__label {
    font-weight: bold;

    display: block;

    margin-bottom: 0.5em;

    &-required {
      color: GetVariable('error');
    }
  }

  &__droparea {
    position: relative;

    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: center;

    padding: 1rem;

    text-align: center;

    border: 2px dashed GetVariable('border-color');
    border-radius: GetVariable('border-radius');
    background-color: GetVariable('input-color');
    background-repeat: no-repeat;
    background-position: center;

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

    &--active {
      border-color: GetVariable('primary');

      &:before {
        opacity: 0.15;
      }

      &.elder-image__droparea--invalid {
        cursor: not-allowed;

        color: GetVariable('error');
        border-color: GetVariable('error');
        background-image: none !important;

        &:before {
          opacity: 0.2;
          background-color: GetVariable('error');
        }

        .elder-image__droparea-instruction {
          background-color: transparent;
        }
      }
    }

    &:hover .elder-image__thumbnail-delete {
      transform: translateY(0);

      opacity: 1;
    }

    .elder-image__thumbnail-delete {
      top: initial;
      right: 1rem;
      bottom: 1rem;
    }

    &-instruction {
      font-size: 0.9em;
      pointer-events: none;

      transition: opacity 250ms ease;

      @media (hover: hover) {
        .elder-image__droparea--selected & {
          padding: 1rem;

          opacity: 0;
          border-radius: GetVariable('border-radius');
          background-color: rgba(white, 0.75);
        }
      }

      .elder-image__droparea:hover &,
      .elder-image__droparea--active & {
        opacity: 1;
      }
    }

    input {
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
  }

  &__uploader {
    margin-top: 1rem;

    .elder-image--inside & {
      position: absolute;
      top: 0;
      right: 0;

      margin-top: 2rem;
      margin-right: 2rem;
    }
  }

  &__thumbnails {
    $space: 1rem;

    display: flex;
    flex-wrap: wrap;

    margin-top: 1rem;
    margin-bottom: -$space;
    margin-left: -$space;

    & > * {
      margin-bottom: $space;
      margin-left: $space;
    }

    .elder-image--inside & {
      position: absolute;
      right: 2rem;
      bottom: 2rem;
    }
  }
}
</style>
