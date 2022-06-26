<!-- 
https://bootstrap-vue.ru/docs/components/calendar/
https://bootstrap-vue.ru/docs/components/form-datepicker

 -->
<template>

    <div id="Header" class="site-head">
        <div class="gridContainer">
            <div id="Title" class="hTitle"> Реестр номеров пересчитанных купюр</div>

            <div id="paramsArea" class="blockParams" >                
                <!-- 
                <myCalendar class="form-control paramItem_1" id="dateStart"> </myCalendar>
                <myCalendar class="form-control paramItem_2" id="dateEnd"> </myCalendar>
                -->
                <input type="date" class="form-control paramItem_1" id="dateStart" v-model="dt_Start" > 
                <input type="date" class="form-control paramItem_2" id="dateEnd" v-model="dt_End"> 
                
               


            </div>
            
           
        </div>
        
        
    </div>

</template>


<script>
    import myCalendar from '@/components/other/calendar.vue'; 
    /* import { Store } from 'vuex'; */

    export default {
        name: 'main_head',
        components: {
            myCalendar
            

        },
        beforeCreate: function () {
        },
        data:  function () {
            return {
            mess: "",
            dt_Start: this.$store.state.mainData.mainFilters.dtStart, 
            dt_End: this.$store.state.mainData.mainFilters.dtEnd


            
            } 
        },
        methods: {
            // через async await 
            /* async getNewsAsyncAwait() {
                const res = await fetch('/firstStart')
                const data = await res.json()
                if (data) {
                    this.news = data
                }
            }, */
            // или через промис
            /* getNewsPromise() {
                fetch('/firstStart')
                    .then(response => response.json())
                    .then(data => this.news = data)
            } */
        },
        created(){
            let dt=this.$store.state.mainData.mainFilters.dtStart;
            dt.setDate(dt.getDate() - 10);
            this.dt_Start = dt.toISOString().split('T')[0];
            this.dt_End = this.$store.state.mainData.mainFilters.dtEnd.toISOString().split('T')[0];
            console.log(`dt_Start == ${this.dt_Start}`);
        },
        mounted() {
            // тут запускаем нужную функцию
            

            //this.getNewsAsyncAwait()
            //this.getNewsPromise()
        }
    }


</script>




<style scoped>
    
    .site-head {
        position: fixed;
        border: 1px ridge rgba(69, 18, 134, 0.6);
        top: 0;
        left: 0;
        right: 0;
        /* height: 40px; */
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
    }

    .gridContainer {
        display: grid;
        /* gap: 5px; */
        /* grid-template-rows:  20px 1fr ; 
        grid-template-columns: repeat(24, 1fr);  */       
        /* grid-template-columns: 300px 1fr 20px; */

        grid-template-areas:
        "Title"
        "Filters"

    }
    .hTitle {
        /* grid-column: 2/5; */
        /* left : 50px; */
        grid-area: Title;
        border: 1px ridge rgba(211, 220, 50, .6);
        color: rgb(122, 16, 16);
        
    }

    .blockParams{
        /* grid-column: 6/23; */
        grid-area: Filters;
        place-items: center / center;

        /* left : 50px; */
        border: 1px ridge rgba(211, 220, 50, .6);
        color: rgb(122, 16, 16);

        display: grid;
        /* gap: 5px; */
        
        grid-template-columns: repeat(20, 1fr); 
        grid-template-rows:  repeat(4, 20px); 
        
    }

    .paramItem_1{
         grid-column: 2/5;
         grid-row: 1;
         height: auto;

    }
    .paramItem_2{
         grid-column: 2/5;
         grid-row: 2;
         height: auto;

    }


</style>>



