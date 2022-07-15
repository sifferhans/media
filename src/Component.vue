<template>
  <div class="kvass-media" :class="['kvass-media--' + placement]">
    <div class="kvass-media__label-wrapper">
      <label v-if="label" class="kvass-media__label">
        {{ label }}
        <span v-if="isRequired" class="kvass-media__label-required">*</span>
        <slot name="after-label" />
      </label>
      <span class="kvass-media__sublabel">
        <slot name="sublabel">{{ sublabel }}</slot>
      </span>
    </div>
    <DropArea
      type="file"
      :accept="$attrs.accept || 'image/*'"
      ref="input"
      :value="value"
      :multiple="multiple"
      v-bind="$attrs"
      v-on="$listeners"
      @select="select"
      @remove="remove"
      :selected="selected"
      :disabled="!hasImage || isDisabled"
      :upload-options="uploadOptions"
      :upload="upload"
    >
      <template #default>
        <TypeSelector :value="typesComp" @add="addItem" :has-image="hasImage" />
      </template>

      <template #preview>
        <component v-if="selected" :is="selected.typeConfig.components.Preview" :value="selected" :size="size" />
      </template>

      <template #drop-message>
        <slot name="drop-message" />
      </template>
      <template #custom-message>
        <slot name="custom-message" />
      </template>
    </DropArea>
    <slot name="bottom" />
    <Draggable v-if="multiple" v-model="items" :disabled="!sortable || isDisabled" class="kvass-media__thumbnails">
      <Thumbnail
        v-for="(item, index) in items"
        :key="index"
        :value="item"
        :disabled="isDisabled"
        @click="selected = item"
        @delete="remove(item)"
      />
    </Draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

import { AttributeBoolean } from './utils'
import Thumbnail from './Thumbnail'
import SlotHandler from './SlotHandler'
import TypeSelector from './TypeSelector'
import Types from './Types'
import DropArea from './DropArea'

import './icons'

export default {
  props: {
    value: [Array, Object],
    types: {
      type: Array,
      default: () => ['Image'],
    },
    label: String,
    sublabel: String,
    multiple: Boolean,
    sortable: {
      type: Boolean,
      default: true,
    },
    upload: Function,
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
  watch: {
    value: {
      handler(val) {
        if (!this.selected) this.select()
      },
      immediate: true,
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
    }
  },

  computed: {
    hasImage() {
      return this.typesComp.some((item) => item.name === 'Image')
    },
    items: {
      get() {
        if (!this.value) return []

        let value = this.value instanceof Array ? this.value : [this.value]
        return value.map((v) => {
          return {
            ...v,
            selected: this.selected && this.selected.url === v.url,
            typeConfig: this.typesComp.find((t) => t.condition(v)),
          }
        })
      },
      set(val) {
        if (!this.multiple) return
        this.$emit(
          'input',
          val.map((v) => {
            let { selected, typeConfig, ...rest } = v
            return rest
          }),
        )
      },
    },
    isDisabled: AttributeBoolean('disabled'),
    isRequired: AttributeBoolean('required'),
    typesComp() {
      return this.types
        .map((type) => {
          if (typeof type === 'string') return Types[type]
          return type
        })
        .filter(Boolean)
    },
  },
  methods: {
    select(val) {
      if (!this.value) return (this.selected = null)
      if (this.multiple && !this.value.length) return (this.selected = null)
      if (val) return (this.selected = val)
      return (this.selected = this.items[0])
    },
    remove(item) {
      let { selected, typeConfig, ...rest } = item
      this.$emit('input', this.multiple ? this.value.filter((v) => v.url !== rest.url) : null)
      if (this.selected.url === item.url) this.$nextTick(() => this.select())
    },

    addItem(item) {
      let value = this.value || []
      this.$emit('input', this.multiple ? [...value, ...[item]] : item)
      this.$nextTick(() => this.select(this.items.find((i) => i.url === item.url)))
    },
  },
  created() {
    this.id = this._uid
  },

  components: {
    Thumbnail,
    Draggable,
    SlotHandler,
    TypeSelector,
    DropArea,
  },
}
</script>

<style lang="scss">
@import './main';

.kvass-media {
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: left;

  &__label {
    font-weight: bold;
    display: flex;
    align-items: end;
    gap: 0.5rem;

    &-required {
      color: GetVariable('error');
    }

    &-wrapper {
      margin-bottom: 0.5em;
    }
  }

  &__sublabel {
    font-size: 0.9em;
    display: block;
    opacity: 0.5;
  }

  &__thumbnails {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.5rem;
    gap: 0.5rem;

    .kvass-media--inside & {
      position: absolute;
      right: 2rem;
      bottom: 2rem;
    }
  }
}
</style>
