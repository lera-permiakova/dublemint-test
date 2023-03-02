<template>
  <div class="facade-dropdown-base">
    <button class="dropdown-header" @click="$emit('onClick')">
      <div class="dropdown-header-selected-option">{{selected}}</div>
      <icon-dropdown-arrow :class="{'icon-arrow-open-list': status}"/>
    </button>
    <transition name="slide-down">
      <ul class="dropdown-currencies-list" v-if="status">
        <li class="dropdown-currencies-item"
            v-for="option in filteredData"
            :key="option"
            @click="$emit('handleChangeOriginal', option)"
        >
          {{option}}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import IconDropdownArrow from '@/icons/Arrow.vue'

export default {
  name: 'FacadeDropdownBase',
  props: {
    status: {
      type: Boolean,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    selected: {
      type: String,
      required: true
    }
  },
  components: {
    IconDropdownArrow
  },
  computed: {
    filteredData () {
      return this.options.filter(option => option !== this.selected)
    }
  }
}
</script>

<style lang="scss" scoped>
  .facade-dropdown-base{
    width: 100%;
    height: max-content;
    margin-bottom: 10px;
    position: relative;
    .dropdown-header{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      height: 52px;
      border: 1px solid #0d3472;
      background-color: #0d3472;
      border-radius: 4px;
      box-sizing: border-box;
      color: #fff;
      overflow: hidden;
      &:hover {
        background-color: rgba(#0d3472, .96);
      }
      &:active {
        background-color: rgba(#0d3472, .96);
        box-shadow: rgba(35,55, 80, .8) inset 0 6px 12px;
      }
      &-selected-option {
        font-weight: bold;
        padding: 0 10px;
      }
      .icon-arrow {
        height: 16px;
        transition: transform .2s linear;

        &-open-list {
          transform: rotate(180deg);
        }
      }
    }
    .dropdown-currencies {
      &-list {
        position: absolute;
        z-index: 4;
        width: 100%;
        margin: 0;
        top: 62px;
        padding: 0;
        overflow: hidden;
        background-color: #fff;
        border: 1px solid #0d3472;
        border-radius: 4px;
        box-sizing: border-box;
        box-shadow: rgba(35,55, 80, .3) 0 6px 12px;
      }
      &-item {
        height: 44px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
        list-style: none;
        color: #0d3472;
        transition: background-color .3s;
        &:hover {
          background-color: #eee;
        }
      }
    }
  }
  .slide-down {
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
</style>
