<template>
  <div id="app">
    <div v-if="$apollo.loading">Loading..</div>
    <div v-else>
      <Recipes/>
    </div>
  </div>
</template>

<script>
import Recipes from './components/Recipes.vue'

export default {
  name: 'app',
  components: {
    Recipes
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  body {
    margin: 0;
    padding: 1rem;
    font-size: 16px;
  }
</style>
