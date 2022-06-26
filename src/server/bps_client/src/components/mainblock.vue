<template>


    <section id="mainblock" class=' mainsection ' style="margin:0">
        
        <main_head></main_head>
    
    </section>    
</template>


<script>
    //import fullscreennews from '@/components/promo/fullscreennews.vue'; 
    import main_head from '@/components/main_head.vue'; 

    
    export default {
    name: 'mainblock',
    components: {

        main_head

    },
    beforeCreate: function () {/* 
        this.$options.components.fullscreennews = require('@/components/promo/fullscreennews.vue').default;
        this.$options.components.socialkeys = require('@/components/other/socialkeys.vue').default;
        */
    },
    data: function () {
        return {
        mess: "Здесь будет что-то...",
        
        }
    },
    methods: {
        // через async await 
        async getNewsAsyncAwait() {
            const res = await fetch('/firstStart')
            const data = await res.json()
            if (data) {
                this.news = data
            }
        },
        // или через промис
        getNewsPromise() {
            fetch('/firstStart')
                .then(response => response.json())
                .then(data => this.news = data)
        }
    },
    mounted() {
        // тут запускаем нужную функцию

        //this.getNewsAsyncAwait() //эту
        //this.getNewsPromise()
    }
}

</script>





<style scoped>
  .mainsection {
      height: 98vh;
      /* background: url("../../img/backgrounds/bgpromo3.jpg") no-repeat center top;  */
      background-size: cover;
      background-repeat:no-repeat;
      background-position: center center;
      /* background-attachment: fixed; */
    }

  

  
  


  .mainblock{
    margin: 0;
    /* background: yellow; */
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
  }


  



  





</style>>

