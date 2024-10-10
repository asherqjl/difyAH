<template>
  <HomeView></HomeView>
  <DocMod></DocMod>
</template>

<script>
import HomeView from './components/home/HomeView.vue'
import DocMod from './components/modal/DocMod.vue'
export default {
  name: 'App',
  components: {
    HomeView,
    DocMod
  }
}

</script>

<style>
</style>
