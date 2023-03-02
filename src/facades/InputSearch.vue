<template>
  <div class="facade-input-search"
       tabindex="0">
    <input
        v-model="baseModel"
        type="text"/>
    <icon-search/>
    <icon-close v-if="baseModel.length"
                :class="{cleaningActive: baseModel.length}"
                @click="clearInput"/>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import IconClose from '@/icons/Close'
import IconSearch from '@/icons/Search'

export default {
  name: 'FacadeInputSearch',
  components: { IconClose, IconSearch },
  props: {
    model: {
      type: String,
      required: true
    }
  },
  created () {
    this.modelDebounceFunction = debounce(() => this.applicableCopyOfEmit(), this.disableDebounce ? 0 : 200)
  },
  data () {
    return {
      baseModel: this.model
    }
  },
  methods: {
    clearInput () {
      if (this.baseModel.length) {
        this.baseModel = ''
      }
    },
    applicableCopyOfEmit () {
      this.$emit('onSearch', this.baseModel)
    }
  },
  watch: {
    model (_model) {
      if (_model !== this.baseModel) this.baseModel = _model
    },
    baseModel () {
      this.modelDebounceFunction()
    }
  }
}
</script>

<style lang="scss" scoped>
  .facade-input-search {
    position: relative;
    width: 100%;
    height: 42px;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 30px;
    background-color: transparent;
    transition: border .2s ease-out;
    border: 1px solid rgba(91,97,110, .7);

    input {
      width: 100%;
      height: 100%;
      padding: 10px 40px;
      border-radius: 30px;
      box-sizing: border-box;
      border: unset;
      background: transparent;
      font-size: 15px;
      line-height: 20px;
    }
    .icon{
      position: absolute;
      color: grey;
      &-search{
        top: 12px;
        left: 12px;
        height: 16px;
      }
      &-close{
        top: 9px;
        right: 9px;
        height: 22px;
        width: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border-radius: 50%;
        transition: .3s all ease-out;
        cursor: pointer;
        &.cleaningActive{
          color: #212A33;
        }

        &:hover{
          color: #0d3472;
          background-color: rgba(91,97,110, .4);
          //&.cleaningActive{
          //  background-color: rgba(91,97,110, .7);
          //}
        }
        &:active {
          transform: scale(.9);
          //background-color: rgba(blue, .7);
        }
      }
    }

    &:focus-within{
      outline-width: 1px;
      border-color: #0d3472;
    }

  }
</style>
