<template>
  <section class="exchange-rates">
    <h2 class="exchange-rates-title">Exchange Rates</h2>

    <article class="exchange-rates-currencies">
      <dropdown-base id="dropdown" :selected="exchangeSelectedCurrency"
                :options="rateOptions"
                :status="exchangeDropdownStatus"
                @onClick="exchangeDropdownStatus = !exchangeDropdownStatus"
                @handleChangeOriginal="selectExchangeCurrency"
      />

      <ul class="exchange-rates-currencies-list">
        <transition-group name="new-item">
          <li class="exchange-rates-currencies-list-item" v-for="(rate, currency) in rangeValues" :key="currency">
            <span>{{ currency }}</span> <span class="exchange-rates-currencies-list-item-rate">{{ rate }}</span>
          </li>
        </transition-group>
      </ul>

      <div class="exchange-rates-currencies-buttons">
        <button class="button-add-currency" @click="modalStatus = true">Add currency</button>
        <button :class="{'button-update-rate' : !buttonDisable, disable: buttonDisable}" @click="updateRates">
          Update
        </button>
      </div>

      <transition name="modal">
        <modal-add-currency :status="modalStatus" @onClose="modalStatus = false" @onSave="handleNewCurrency"/>
      </transition>

    </article>
  </section>
</template>

<script>
import DropdownBase from '@/facades/DropdownBase.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ModalAddCurrency from '@/modals/ModalAddCurrency'

export default {
  name: 'ExchangeRates',
  components: {
    DropdownBase,
    ModalAddCurrency
  },
  async mounted () {
    this.updateOriginalRate('USD')
  },
  data () {
    return {
      exchangeDropdownStatus: false,
      rateOptions: ['USD', 'EUR', 'UAH'],

      modalStatus: false,
      buttonDisable: false
    }
  },
  computed: {
    ...mapGetters({
      exchangeSelectedCurrency: 'exchangeSelectedCurrency',
      currentCurrencyRate: 'currentCurrencyRate',
      rateValues: 'getRates'
    }),
    rangeValues () {
      return Object.fromEntries(Object.entries(this.currentCurrencyRate).filter(m => this.rateValues.includes(m[0])))
    }
  },
  methods: {
    ...mapMutations({
      updateOriginalCurrency: 'updateOriginalCurrency',
      updateOriginalRate: 'updateOriginalRate',
      updateNewRates: 'updateNewRates'
    }),
    ...mapActions({
      fetchCurrencies: 'fetchCurrencies'
    }),
    selectExchangeCurrency (newSelected) {
      this.updateOriginalRate(newSelected)
      this.fetchCurrencies(newSelected)
      this.exchangeDropdownStatus = false
    },
    handleNewCurrency (newCurrenciesArr) {
      this.modalStatus = false
      this.updateNewRates(newCurrenciesArr)
      this.fetchCurrencies()
    },
    updateRates () {
      if (!this.buttonDisable) {
        this.fetchCurrencies(this.exchangeSelectedCurrency)
        this.buttonDisable = true
        setTimeout(() => {
          this.buttonDisable = false
        }, 5000)
      }
    },
    hideDropdownRates (event) {
      const dropdown = document.querySelector('#dropdown')
      const withinBoundaries = event.composedPath().includes(dropdown)
      if (!withinBoundaries) {
        this.exchangeDropdownStatus = false
      }
    }
  },
  watch: {
    exchangeDropdownStatus (status) {
      if (status) {
        document.addEventListener('click', this.hideDropdownRates.bind(this), true)
      } else {
        document.removeEventListener('click', this.hideDropdownRates)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .exchange-rates{
    padding: 20px 0;
    &-title {
      margin: 0 0 20px;
      color: #212A33;
      font-size: 30px;
    }
    &-currencies {
      margin: 0 auto;
      padding: 28px;
      background-color: #fff;
      box-shadow: rgba(35,55, 80, .3) 0 6px 12px;
      border-radius: 4px;
      display: grid;
      grid-template-columns: 1fr;
      column-gap: 20px;
      @include respond-to(tablet) {
        padding: 40px;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 170px 114px 1fr;
      }
      @include respond-to(laptop) {
        column-gap: 60px;
      }
      &-list {
        border: 2px solid #c55307;
        border-radius: 4px;
        margin: 0 0 20px;
        padding: 0;
        @include respond-to(tablet) {
          margin-bottom: 0;
          grid-column-start: 2;
          grid-column-end: 3;
          grid-row-start: 1;
          grid-row-end: 4;
        }
        &-item {
          height: 56px;
          padding-left: 20px;
          display: grid;
          grid-template-columns: 34% 1fr;
          align-items: center;
          box-sizing: border-box;
          &:not(:last-child) {
            border-bottom: 1px solid rgba(#c55307, .1);
          }
          &-rate {
            color: #dda988;
          }
        }
      }

      &-buttons {
        align-self: flex-start;
        transition: all .3s;
        button {
          height: 52px;
          width: 100%;
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color .3s linear;
          box-shadow: rgba(35,55, 80, .3) 0 6px 12px;
          box-sizing: border-box;
        }
        .button-add-currency {
          margin-bottom: 10px;
          background-color: #c55307;
            &:hover {
              background-color: rgba(#c55307, .92);
            }
            &:active {
              box-shadow: rgba(35,55, 80, .5) inset 0 6px 12px;
            }
        }
        .button-update-rate {
          background-color: #004d00;
          &:hover {
            background-color: rgba(#004d00, .92);
          }
          &:active {
            box-shadow: rgba(35,55, 80, .5) inset 0 6px 12px;
          }
        }
        .disable {
          background-color: #004d00;
          cursor: not-allowed;
        }
      }
    }

  }
  .new-item {
    &-enter-from, &-leave-to {
      opacity: 0;
      transform: translateY(-10px);
    }
    &-enter-to, &-leave-from {
      opacity: 1;
      transform: translateY(0);
    }
    &-enter-active, &-leave-active {
      transition: all .2s linear;
    }
  }
  .modal {
    &-enter-from, &-leave-to {
      opacity: 0;
    }
    &-enter-to, &-leave-from {
      opacity: 1;
    }
    &-enter-active, &-leave-active {
      transition: all .2s linear;
    }
  }
</style>
