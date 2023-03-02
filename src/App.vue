<template>
  <div class="app-main">
    <header class="app-main-header">
      <div class="app-main-header-content">
        <h1 class="app-main-header-content-title">Dublemint</h1>
        <img class="app-main-header-content-logo" src="./assets/logo.png">
      </div>
    </header>
    <main class="app-main-content">
      <currency-converter/>
      <exchange-rates/>
    </main>
  </div>
</template>

<script>
/* eslint-disable */
  // import { defineComponent } from 'vue';
  import CurrencyConverter from '@/components/CurrencyConverter.vue';
  import ExchangeRates from "@/components/ExchangeRates";
  import {mapActions} from "vuex";

  export default {
    name: 'App',
    components: {
      CurrencyConverter,
      ExchangeRates
    },
    async mounted() {
      await this.fetchCurrencies('USD')
    },
    methods: {
      ...mapActions({
        fetchCurrencies: 'fetchCurrencies',
      }),
    }
  };
</script>

<style lang="scss">
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #edf8fd;
  }
  .app-main {
    min-width: 270px;
    box-sizing: border-box;
    &-header {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 5;
      padding: 16px 20px;
      background-color: #212A33;
      color: #edf8fd;
      box-shadow: 0 4px 12px 1px rgba(#3B4147, .4);

      &-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1025px;
        margin: 0 auto;
        &-title {
          margin: 0;
          font-size: 30px;
        }
      }
      @include respond-to(laptop) {
        padding: 16px 40px;
      }
    }
    &-content {
      padding: 0 20px;
      max-width: 1025px;
      margin: 0 auto;
      @include respond-to(laptop) {
        padding: 0 40px;
      }
    }
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    button {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      font-weight: 600;
      font-size: 16px;
    }
  }

</style>
