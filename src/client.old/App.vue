<template>

  <div id="app">


    <Main_block>  </Main_block>
    <!-- <section_products >  </section_products> -->
    <!-- <products_sections_list>  </products_sections_list> -->


  </div>





</template>

<script>
  import section_promo from '@/components/main_block.vue ';
  
  // import section_products from '@/components/section_products/section_products';




export default {
  name: 'App',

  components: {
    
    section_promo,
    //section_products,
    
    
  },
  beforeCreate: function () {
        // this.$options.components.products_sections_list = require('@/components/section_products/products_sections_list').default;
  
       
    },
}



</script>

<style>
#app {
  font-family:  Roboto, Helvetica, Arial, sans-serif; /* , Roboto, Avenir, Lobster */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
