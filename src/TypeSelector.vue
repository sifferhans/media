<template>
  <div class="kvass-media-type-selector">
    <DropdownComponent>
      <ButtonComponent :label="label.select" type="button" />
      <template #dropdown>
        <component
          :is="item.Components.CreateTrigger"
          v-for="item in itemComp"
          :key="item.Name"
          @click.native="show = item"
        />
      </template>
    </DropdownComponent>
    <ModalComponent :show="Boolean(show)" @close="show = null" class="kvass-media-type-selector__modal">
      <Card theme="flat" tag="form" @submit.prevent="submit">
        <template #default>
          <component
            v-if="show"
            :is="show.Components.Create"
            :is-valid.sync="isValid"
            :upload="upload"
            ref="creator"
            v-on="$listeners"
          />
        </template>
        <template #footer>
          <ButtonComponent :label="label.cancel" type="button" @click="show = null" />
          <ButtonComponent
            theme="primary"
            :disabled="!isValid"
            :promise="promise"
            :label="label.save"
            type="submit"
            @onSuccess="show = null"
          />
        </template>
      </Card>
    </ModalComponent>
  </div>
</template>

<script>
import { ModalComponent } from 'vue-elder-modal'
import { ButtonComponent } from 'vue-elder-button'
import Card from '@kvass/card'
import { Options } from '../index'

import { DropdownComponent } from 'vue-elder-dropdown'

export default {
  props: {
    value: Array,
    upload: Function,
  },
  data() {
    return {
      show: null,
      promise: null,
      isValid: true,
    }
  },
  computed: {
    itemComp() {
      return this.value.filter((item) => item.Name !== 'Image')
    },
    label() {
      return Options.actionLabels
    },
  },
  methods: {
    submit() {
      if (!this.isValid) return
      this.promise = this.$refs.creator.prepareData().then((data) => {
        this.$emit('add', data)
      })
    },
  },
  components: {
    ModalComponent,
    Card,
    ButtonComponent,
    DropdownComponent,
  },
}
</script>

<style lang="scss">
.kvass-media-type-selector {
  display: flex;
  justify-content: center;
  &__item {
    margin-top: 1rem;
    margin-right: 1rem;
  }
}
.kvass-card {
  max-width: 700px;
  width: 100%;
}
</style>
