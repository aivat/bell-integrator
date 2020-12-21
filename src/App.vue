<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Главная</router-link> |
      <router-link to="/action-history">История</router-link> |
      <router-link :to="`/action-history?type=${actionType.RESTORE}`">История восстановления</router-link> |
      <router-link :to="`/action-history?type=${actionType.DISMISS}`">История увольнений</router-link>
    </div>
    <router-view class="router-view"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {ActionType} from '@/store/modules/employees';

@Component
export default class App extends Vue {  
  get actionType(): typeof ActionType {
    return ActionType;
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

#nav {
  padding: 16px 0;
  top: 0;
  position: sticky;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  font-size: 16px;
  line-height: 24px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.router-view {
  padding-top: 20px;
}
</style>
