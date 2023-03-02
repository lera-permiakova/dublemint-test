<template>
  <div class="facade-input-currency"
       tabindex="0">
    <label class="input-label" v-if="labeled">limit: max amount 20 000$</label>
    <input
        :value="baseModel"
        @input="$emit('onInput', $event.target.value)"
        type="number"
        max="10000"
        :autofocus="autofocus"
        @keydown="handleInputCharacters"
        @blur="handleBlur"
        @focus="$emit('onFocus')"
    >
  </div>
</template>

<script>
export default {
  name: 'FacadeInputCurrency',
  props: {
    model: {
      type: String,
      required: true
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    labeled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      baseModel: this.model
    }
  },
  methods: {
    handleBlur (e) {
      if (!(e.relatedTarget && e.relatedTarget.contains(e.target))) this.$emit('onBlur')
    },
    handleInputCharacters (e) {
      if (this.labeled && e.keyCode !== 8) return e.preventDefault()
      return [69, 187, 189, 190].includes(e.keyCode) && e.preventDefault()
    }
  },
  watch: {
    model (_model) {
      if (_model !== this.baseModel) this.baseModel = _model
    }
  }
}
</script>

<style lang="scss" scoped>
  .facade-input-currency{
    position: relative;
    width: 100%;
    height: 52px;
    margin-bottom: 10px;
    border: 1px solid rgba(91,97,110, .7);
    border-radius: 4px;
    box-sizing: border-box;
    //overflow: hidden;
    transition: all .2s ease-in;
    .input-label {
      color: rgba(red, .6);
      font-weight: 400;
      font-size: 12px;
      position: absolute;
      top: -22px;
      z-index: 2;
    }

    input{
      width: 100%;
      height: 100%;
      background-color: rgba(#fff, .7);
      padding: 0 10px;
      box-sizing: border-box;
      border: none;
      border-radius: 4px;
      color: #000;
      font-weight: 400;
      font-size: 15px;
      line-height: 20px;
    }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type='number'],
    input[type="number"]:hover,
    input[type="number"]:focus {
      appearance: none;
      -moz-appearance: textfield;
    }
    &:focus-within{
      outline-width: 1px;
      border-color: #0d3472;
    }
}
</style>
