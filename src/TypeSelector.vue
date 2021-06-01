<template>
  <div class="kvass-media__type-selector">
    <component :is="item.Components.CreateTrigger" v-for="item in value" :key="item.Name" @click.native="show = item" />
    <ModalComponent :show="Boolean(show)" @close="show = null" clickaway>
      <Card theme="flat">
        <template #default>
          <component v-if="show" :is="show.Components.Create" />
        </template>
        <template #footer>
          <ButtonComponent label="Avbryt" />
          <ButtonComponent theme="primary" label="Lagre" />
        </template>
      </Card>
    </ModalComponent>
  </div>
</template>

<script>
import { ModalComponent } from 'vue-elder-modal'
import { ButtonComponent } from 'vue-elder-button'
import Card from '@kvass/card'

export default {
  props: {
    value: Array,
  },
  data() {
    return {
      show: null,
    }
  },
  components: {
    ModalComponent,
    Card,
    ButtonComponent,
  },
}
</script>

<style lang="scss">
.kvass-media__type-selector {
  display: flex;
}
</style>
