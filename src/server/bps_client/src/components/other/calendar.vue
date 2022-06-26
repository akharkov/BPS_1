
<!-- 
    https://bootstrap-vue.ru/docs/components/form-datepicker
 -->

<template>
  
    

    
        <b-form-datepicker 
            placeholder="Выберите дату"
            id="datepicker-dateformat2"            
            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
            locale="ru"
            start-weekday="1"
            size="sm"
            label-help=""
            label-no-date-selected="Дата не выбрана"
           
            
        > 
        
        </b-form-datepicker>
   
 
</template>


<script>
  export default {
    name: 'myCalendar',
    data() {
      return {
        value: ''
      }
    }
  }
</script>


