<template>

  <div id="app">


    <mainblock> </mainblock>
    

  </div> 





</template>

<script>
  // import section_promo from '@/components/promo/section_promo';
  
  // import section_products from '@/components/section_products/section_products';
import mainblock from '@/components/mainblock.vue';
import main_head from '@/components/main_head.vue';


export default {
  name: 'app',
  

  components: {
    
    mainblock,
    main_head
   
    
  },
  beforeCreate: function () {
    this.$options.components.mainblock = require('@/components/mainblock.vue').default;
    this.$options.components.main_head = require('@/components/main_head.vue').default;

       
    },
}



</script>

<style>
  /* #app {
    font-family:  Roboto, Helvetica, Arial, sans-serif; // , Roboto, Avenir, Lobster 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
   
  } */
  
</style>
