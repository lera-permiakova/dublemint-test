<template>
  <div class="modal-add-currency" v-if="status">
    <div class="modal-add-currency-body">
      <input-search :model="inputModel" @onSearch="inputModel = $event"/>
      <div class="modal-add-currency-plate">
        <ul class="modal-add-currency-list" v-if="filteredCurrencies.length">
          <li class="modal-add-currency-list-item"
              :class="{active: chosenNewCurrencies.includes(abbr)}"
              v-for="([abbr, name]) in filteredCurrencies"
              :key="abbr"
              @click="handleChosenCurrency(abbr)"
          >
            <icon-select/>
            <div class="modal-add-currency-list-item-abbreviation">{{abbr}}</div>
            <div class="modal-add-currency-list-item-name">{{name}}</div>
          </li>
        </ul>
        <div v-else class="modal-add-currency-list-empty">No results available</div>
      </div>
      <div class="modal-add-currency-button-block">
        <button class="modal-button-cancel" @click="handleCloseClick">Cancel</button>
        <button class="modal-button-save" @click="handleSaveNewCurrencies">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from '@/facades/InputSearch'
import IconSelect from '@/icons/Select'
import { mapGetters } from 'vuex'

export default {
  name: 'ModalAddCurrency',
  components: { InputSearch, IconSelect },
  props: {
    status: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      inputModel: '',
      chosenNewCurrencies: []
    }
  },
  computed: {
    ...mapGetters({
      newCurrencies: 'getNewCurrencies'
    }),
    filteredCurrencies () {
      return this.newCurrencies.filter(curr => {
        const abbr = curr[0].toLowerCase()
        const name = curr[1].toLowerCase().split(' ')
        const searchStr = this.inputModel.trim().toLowerCase()

        return abbr.startsWith(searchStr) || name.some(w => w.startsWith(searchStr))
      })
    }
  },
  methods: {
    handleChosenCurrency (currency) {
      const index = this.chosenNewCurrencies.findIndex(c => c === currency)
      if (index >= 0) {
        this.chosenNewCurrencies.splice(index, 1)
      } else {
        this.chosenNewCurrencies.push(currency)
      }
    },
    handleCloseClick () {
      this.$emit('onClose')
      this.chosenNewCurrencies = []
      this.inputModel = ''
    },
    handleSaveNewCurrencies () {
      if (this.chosenNewCurrencies.length) {
        this.$emit('onSave', this.chosenNewCurrencies)
      }
      this.handleCloseClick()
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal-add-currency{
    display: flex;
    position: fixed;
    z-index: 6;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    background-color: rgba(#000, .4);

    &-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 620px;
      width: 620px;
      margin: auto;
      position: relative;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 8px;
      padding: 20px 10px;
      overflow: hidden;
      @include respond-to(tablet) {
        padding: 40px 60px;
      }
      @include respond-to(laptop) {
        padding: 48px 82px;
      }
      .facade-input-search {
        margin-bottom: 20px;
      }
    }
    &-plate {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      border: 1px black solid;
      border-radius: 8px;
      height: 200px;
      box-sizing: border-box;
      overflow: hidden;
      box-shadow: inset 0 0 8px rgba(#000, .1);

    }
    &-list {
      margin: 0;
      padding: 0;
      scroll-behavior: smooth;
      overflow-y: scroll;
      scrollbar-width: 0;
      &::-webkit-scrollbar {
        width: 0;
      }
      &-item {
        position: relative;
        padding: 10px 0;
        list-style: none;
        display: grid;
        grid-template-columns: 32px 76px 1fr;
        cursor: pointer;
        overflow: hidden;
        transition: background-color .3s;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        &:not(:last-child) {
          margin-bottom: 2px;
        }
        &:hover {
          background-color: rgba(lightsteelblue, 0.2);
        }
        @include respond-to(tablet) {
          grid-template-columns: 42px 112px 1fr;
        }
        @include respond-to(laptop) {
          grid-template-columns: 42px 180px 1fr;
        }
        &-abbreviation {
          align-self: center;
          color: #c55307;
        }
        &-name {
          color: #0d3472;
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          //display: none;
        }

        .icon-select {
          display: inherit;
          align-self: center;
          justify-self: center;
          color: #e0e0e0;
          left: 10px;
          @include respond-to(tablet) {
            left: 15px;
          }
        }
      }
      &-empty {
        margin: 20px auto;
        color: #e0e0e0;
      }
    }
    &-button-block{
      display: flex;
      justify-content: space-between;
      button {
        width: 160px;
        height: 40px;
        border-radius: 30px;
        border: none;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
      .modal-button-cancel {
        background-color: #c55307;
        margin-right: 8px;
        &:hover {
          background-color: rgba(#c55307, .92);
        }
        &:active {
          box-shadow: rgba(35,55, 80, .5) inset 0 4px 8px;
        }
      }
      .modal-button-save {
        background-color: #004d00;
        &:hover {
          background-color: rgba(#004d00, .92);
        }
        &:active {
          box-shadow: rgba(35,55, 80, .5) inset 0 4px 8px;
        }
      }
    }
    .active {
      background-color: rgba(lightsteelblue, 0.2);;
      &:hover {
        background-color: rgba(lightsteelblue, 0.2);
      }
      .icon-select {
        color: #212A33;
      }
    }
  }
</style>
