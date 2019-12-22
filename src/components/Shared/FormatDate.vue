<template>
  <div style="block">
    {{ formatDate(date) }}
  </div>
</template>

<script>
  export default {
    props: ['date'],
    methods: {
      formatDate (date) {
        // const newDate = new Date(date)
        // var year = newDate.getUTCFullYear()
        // var month = newDate.getUTCMonth() + 1  // getMonth() is zero-indexed, so we'll increment to get the correct month number
        // var day = newDate.getUTCDate()
        // var hours = newDate.getUTCHours()
        // var minutes = newDate.getUTCMinutes()
        // var seconds = newDate.getUTCSeconds()
        //
        // month = (month < 10) ? '0' + month : month
        // day = (day < 10) ? '0' + day : day
        // hours = (hours < 10) ? '0' + hours : hours
        // minutes = (minutes < 10) ? '0' + minutes : minutes
        // seconds = (seconds < 10) ? '0' + seconds: seconds
        //
        // const setDate = year + '-' + month + '-' + day
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        let current_datetime = new Date(date)
        let apmHr = 0
        let apm = ''
        if (current_datetime.getHours() < 12) {
          apmHr = current_datetime.getHours()
          apm = 'AM'
        }
        if (current_datetime.getHours() >= 12) {
          apmHr = current_datetime.getHours() - 12
          apm = 'PM'
        }
        let formatMinutes = current_datetime.getMinutes()
        if (formatMinutes < 10) {
          formatMinutes = '0' + formatMinutes
        }
        let formatted_date =
          current_datetime.getDate() + '-' +
          months[current_datetime.getMonth()] + '-' +
          current_datetime.getFullYear() +
          ' ' +
          apmHr + ':' +
          formatMinutes +
          apm
        // console.log(formatted_date)
        return formatted_date
      // return date.toUTCString()
      }
    }
  }
</script>
