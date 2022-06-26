

<template>



</template>


<script>
        //import fullscreennews from '@/components/promo/fullscreennews.vue'; 

    export default {
    name: 'xxx',
    components: {
        

    },
    beforeCreate: function () {
    },
    data: function () {
        return {
        mess: "",
        
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

        //this.getNewsAsyncAwait()
        //this.getNewsPromise()
    }
}

</script>




<style scoped>


</style>>



