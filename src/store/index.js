import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Secure from './Secure'

export default createStore({
  state: {
    currencies: { USD: {} },
    originalCurrency: 'USD',
    prevCurrency: 'USD',
    rateCurrency: 'USD',
    prevRateCurrency: 'USD',
    newCurrencies: [
      ['AED', 'United Arab Emirates dirham'],
      ['AMD', 'Armenian dram'],
      ['ARS', 'Argentine peso'],
      ['AUD', 'Australian dollar'],
      ['BGN', 'Bulgarian lev'],
      ['BRL', 'Brazilian real'],
      ['CAD', 'Canadian dollar'],
      ['CHF', 'Swiss franc'],
      ['COP', 'Colombian peso'],
      ['CZK', 'Czech krona'],
      ['DKK', 'Danish krone'],
      ['DASH', 'Crypto'],
      ['EGP', 'Egyptian pound'],
      ['EOS', 'Crypto'],
      ['GEL', 'Georgian lari'],
      ['HKD', 'Hong Kong dollar'],
      ['ILS', 'Israeli new shekel'],
      ['JPY', 'Japanese yen'],
      ['KRW', 'South Korean won'],
      ['KZT', 'Kazakhstan tenge'],
      ['MDL', 'Moldovan leu'],
      ['MXN', 'Mexican peso'],
      ['NEO', 'Crypto'],
      ['NOK', 'Norwegian krone'],
      ['PHP', 'Philippine peso'],
      ['RSD', 'Serbian dinar'],
      ['SEK', 'Swedish krona'],
      ['SGD', 'Singapore dollar'],
      ['THB', 'Thai baht'],
      ['TRY', 'Turkish lira'],
      ['VND', 'Vietnamese đồng'],
      ['WAVES', 'Crypto']
    ],
    baseRateCurrencies: 'USD,EUR,UAH,GBP,BTC,ETH,BNB,XRP,',
    rateValues: ['USD', 'EUR', 'UAH', 'BTC', 'ETH']
  },
  getters: {
    allCurrencies: (state) => state.currencies,
    originalCurrency: (state) => state.originalCurrency,

    currentCurrencyExchange: (state) => {
      if (!Object.prototype.hasOwnProperty.call(state.currencies, state.originalCurrency)) {
        state.currencies[state.originalCurrency] = { ...state.currencies[state.prevCurrency] }
      }
      return state.currencies[state.originalCurrency]
    },

    exchangeSelectedCurrency: (state) => state.rateCurrency,
    currentCurrencyRate: (state) => {
      if (!Object.prototype.hasOwnProperty.call(state.currencies, state.rateCurrency)) {
        state.currencies[state.rateCurrency] = { ...state.currencies[state.prevRateCurrency] }
      }
      return state.currencies[state.rateCurrency]
    },
    getNewCurrencies: (state) => state.newCurrencies,
    getRates: (state) => state.rateValues,
    getDollarExchangeRate: (state) => state.currencies.USD
  },
  mutations: {
    updateCurrenciesExchanges (state, currencyExchange) {
      state.currencies[currencyExchange[0]] = currencyExchange[1]
    },
    updateOriginalCurrency: (state, value) => {
      state.prevCurrency = state.originalCurrency
      state.originalCurrency = value
    },

    updateOriginalRate: (state, value) => {
      state.prevRateCurrency = state.rateCurrency
      state.rateCurrency = value
    },
    updateNewRates: (state, newRates) => {
      state.baseRateCurrencies += newRates.join(',') + ','
      newRates.map(el => state.rateValues.push(el))
      state.newCurrencies = state.newCurrencies.filter(el => !state.rateValues.includes(el[0]))
    }
  },
  actions: {
    async fetchCurrencies ({ commit, state }, curr = state.rateCurrency) {
      const originalCurr = curr
      try {
        const res = await fetch(
              `https://min-api.cryptocompare.com/data/price?fsym=${originalCurr}&tsyms=${state.baseRateCurrencies}?fee1a45329880288f388d9673ecb3e942047f17c6ced96da862295b790a21404`
        )
        const data = await res.json()
        commit('updateCurrenciesExchanges', [originalCurr, data])
      } catch (e) {
      }
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      key: 'session',
      storage: {
        getItem: (key) => Secure.get(key),
        setItem: (key, value) => Secure.set(key, value),
        removeItem: (key) => Secure.remove(key)
      }
    })
  ]
})
