<template>
  <section class="currency-converter">
    <h2 class="currency-converter-title">Currency converter</h2>

    <div class="currency-converter-table">
      <article class="currency-converter-block">
        <input-currency :model="originalCurrencyModel"
                        autofocus
                        :labeled="errorLimitStatusOriginal"
                        @onInput="handleOriginalCurrencyInput"
                        @onBlur="errorLimitStatusOriginal = false"
        />
        <dropdown-base id="dropdown-1" :selected="selectedOriginalCurrency"
                  :options="currencyOptions"
                  :status="dropdownStatusOriginal"
                  @onClick="dropdownStatusOriginal = !dropdownStatusOriginal"
                  @handleChangeOriginal="selectOriginalCurrency"
        />
      </article>

      <article class="currency-converter-block">
        <input-currency :model="expectedCurrencyModel"
                        :labeled="errorLimitStatusExpected"
                        @onInput="handleExpectedCurrencyInput"
                        @onBlur="errorLimitStatusExpected = false"
                        @onFocus="errorLimitStatusOriginal = false"
        />
        <dropdown-base id="dropdown-2" :selected="selectedExpectedCurrency"
                  :options="currencyOptions"
                  :status="dropdownStatusExpected"
                  @onClick="dropdownStatusExpected = !dropdownStatusExpected"
                  @handleChangeOriginal="selectExpectedCurrency"
        />
      </article>
    </div>
  </section>
</template>

<script>
import InputCurrency from '@/facades/InputCurrency.vue'
import DropdownBase from '@/facades/DropdownBase.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CurrencyConverter',
  components: {
    InputCurrency,
    DropdownBase
  },
  async mounted () {
    this.updateOriginalCurrency('USD')
  },
  data () {
    return {
      dropdownStatusOriginal: false,
      dropdownStatusExpected: false,
      selectedExpectedCurrency: 'BTC',
      currencyOptions: ['USD', 'EUR', 'UAH', 'GBP', 'BTC', 'ETH', 'BNB', 'XRP'],
      fixedCurrencyValues: ['USD', 'EUR', 'UAH', 'GBP'],
      originalCurrencyModel: '1',
      expectedCurrencyModel: '0',

      errorLimitStatusOriginal: false,
      errorLimitStatusExpected: false
    }
  },
  computed: {
    ...mapGetters({
      allCurrencies: 'allCurrencies',
      selectedOriginalCurrency: 'originalCurrency',
      currentCurrencyExchange: 'currentCurrencyExchange',

      dollarExchangeRate: 'getDollarExchangeRate'
    })
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
    selectOriginalCurrency (newSelected) {
      this.updateOriginalCurrency(newSelected)
      this.fetchCurrencies(newSelected)
      this.dropdownStatusOriginal = false
    },
    selectExpectedCurrency (newSelected) {
      this.selectedExpectedCurrency = newSelected
      this.handleOriginalCurrencyInput(this.originalCurrencyModel)
      this.dropdownStatusExpected = false
    },
    hideDropdownOriginal (event) {
      const dropdown = document.querySelector('#dropdown-1')
      const withinBoundaries = event.composedPath().includes(dropdown)
      if (!withinBoundaries) {
        this.dropdownStatusOriginal = false
      }
    },
    hideDropdownExpected (event) {
      const dropdown = document.querySelector('#dropdown-2')
      const withinBoundaries = event.composedPath().includes(dropdown)
      if (!withinBoundaries) {
        this.dropdownStatusExpected = false
      }
    },
    handleOriginalCurrencyInput (value) {
      this.originalCurrencyModel = this.fixedCurrencyValues.includes(this.selectedOriginalCurrency) ? (Math.trunc(+value * 100) / 100).toString() : value
      if (this.dollarExchangeRate[this.selectedOriginalCurrency] * 10000 >= value) {
        this.expectedCurrencyModel = this.fixedCurrencyValues.includes(this.selectedExpectedCurrency)
          ? (Math.trunc(this.currentCurrencyExchange[this.selectedExpectedCurrency] * (+this.originalCurrencyModel) * 100) / 100).toString()
          : (+this.currentCurrencyExchange[this.selectedExpectedCurrency] * (+this.originalCurrencyModel)).toString()
        if (this.errorLimitStatusOriginal) this.errorLimitStatusOriginal = false
      } else {
        this.errorLimitStatusOriginal = true
        this.expectedCurrencyModel = '0'
      }
    },
    handleExpectedCurrencyInput (value) {
      this.expectedCurrencyModel = this.fixedCurrencyValues.includes(this.selectedExpectedCurrency) ? (Math.trunc(+value * 100) / 100).toString() : value
      if (this.dollarExchangeRate[this.selectedExpectedCurrency] * 10000 >= value) {
        this.originalCurrencyModel = this.fixedCurrencyValues.includes(this.selectedOriginalCurrency)
          ? (Math.trunc(this.expectedCurrencyModel / this.currentCurrencyExchange[this.selectedExpectedCurrency] * 100) / 100).toString()
          : (this.expectedCurrencyModel / this.currentCurrencyExchange[this.selectedExpectedCurrency]).toString()
        if (this.errorLimitStatusExpected) this.errorLimitStatusExpected = false
      } else {
        this.errorLimitStatusExpected = true
        this.originalCurrencyModel = '0'
      }
    }
  },
  watch: {
    dropdownStatusOriginal (status) {
      if (status) {
        document.addEventListener('click', this.hideDropdownOriginal.bind(this), true)
      } else {
        document.removeEventListener('click', this.hideDropdownOriginal)
      }
    },
    dropdownStatusExpected (status) {
      if (status) {
        document.addEventListener('click', this.hideDropdownExpected.bind(this), true)
      } else {
        document.removeEventListener('click', this.hideDropdownExpected)
      }
    },
    currentCurrencyExchange () {
      if (this.dollarExchangeRate[this.selectedOriginalCurrency] * 10000 >= this.originalCurrencyModel) {
        this.expectedCurrencyModel = this.fixedCurrencyValues.includes(this.selectedExpectedCurrency)
          ? (Math.trunc(this.currentCurrencyExchange[this.selectedExpectedCurrency] * (+this.originalCurrencyModel) * 100) / 100).toString()
          : (+this.currentCurrencyExchange[this.selectedExpectedCurrency] * (+this.originalCurrencyModel)).toString()
      } else {
        this.errorLimitStatusOriginal = true
        this.expectedCurrencyModel = '0'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .currency-converter{
    padding: 20px 0;
    &-title {
      margin: 0 0 20px;
      color: #212A33;
      font-size: 30px;
    }
    &-table {
      padding: 32px 20px 20px;
      background-color: #fff;
      box-shadow: rgba(35,55, 80, .3) 0 6px 12px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      @include respond-to(tablet) {
        padding: 40px;
        flex-direction: row;
      }
    }
    &-block{
      width: 100%;
      &:first-child {
        margin-bottom: 20px;
        @include respond-to(tablet) {
          margin-right: 20px;
          margin-bottom: 0;
        }
        @include respond-to(laptop) {
          margin-right: 60px;
        }
      }

    }
  }
</style>
