<!-- components/calendarComponent/calendarComponent.vue -->
<template lang="pug">
.calendarTemp
  .calendar-header
    button.prev(@click="prevMonth") 上個月
    span {{ year }} 年{{ month + 1 }} 月
    button.next(@click="nextMonth") 下個月
  .calendar-body
    .calendar-week
      span(v-for="day in weekDays" :key="day") {{ day }}
    .calendar-dates
      span.calendar-date(
        v-for="day in days"
        :key="day.dateIndex"
        @click="handleDateClick(day)"
        :class="getDateClass(day)"
      ) {{ day.date || '' }}
</template>

<script>
import { container } from "@/containers/index-dist.js";

export default {
  name: 'calendarComponent',
  props: { indexMonth: { type: [Array, String], default: () => [] } },
  data(){
    return {
      weekDays: ['日','一','二','三','四','五','六'],
      today: new Date(),
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      selectedDate: null,
      rangeSelectedDates: [],
      highlightedDates: [],
    }
  },
  computed: {
    days(){
      const startOfMonth = new Date(this.year, this.month, 1)
      const endOfMonth = new Date(this.year, this.month + 1, 0)
      const daysInMonth = endOfMonth.getDate()
      const dates = []
      const startDayOfWeek = startOfMonth.getDay()
      for (let i=0;i<startDayOfWeek;i++) dates.push({ date:null, isCurrentMonth:false, dateIndex:`empty-before-${i}` })
      for (let i=1;i<=daysInMonth;i++){
        const isToday = this.year===this.today.getFullYear() && this.month===this.today.getMonth() && i===this.today.getDate()
        const dayOfWeek = new Date(this.year, this.month, i).getDay()
        const isWeekend = dayOfWeek===0 || dayOfWeek===6
        dates.push({ date:i, isCurrentMonth:true, isToday, isWeekend, dateIndex:`current-${i}` })
      }
      const remaining = 42 - dates.length
      for (let i=0;i<remaining;i++) dates.push({ date:null, isCurrentMonth:false, dateIndex:`empty-after-${i}` })
      return dates
    }
  },
  methods: {
    prevMonth(){ if(this.month===0){ this.month=11; this.year-=1 } else { this.month-=1 }; this.selectedDate=null; this.$emit('date-selected', `${this.year}-${this.month*1<9?"0"+(this.month*1+1):this.month*1+1}`) },
    nextMonth(){ if(this.month===11){ this.month=0; this.year+=1 } else { this.month+=1 }; this.selectedDate=null; this.$emit('date-selected', `${this.year}-${this.month*1<9?"0"+(this.month*1+1):this.month*1+1}`) },
    handleDateClick(day){
      if(day.date && day.isCurrentMonth){
        const selected = { date:day.date, month:this.month, year:this.year }
        if(this.rangeSelectedDates.length>0){ this.selectedDate=null; this.rangeSelectedDates=[]; return }
        else if(this.selectedDate && (this.selectedDate.date!==selected.date || this.selectedDate.month!==selected.month || this.selectedDate.year!==selected.year)){
          const rangeStart = this.selectedDate; const rangeEnd = selected
          const [start,end] = this.getOrderedRange(rangeStart, rangeEnd)
          this.markRangeAsSelected(start,end)
        } else { this.selectedDate=null; this.rangeSelectedDates=[] }
        this.selectedDate = selected
        this.$emit('date-selected', this.rangeSelectedDates.length ? this.rangeSelectedDates : this.selectedDate)
      }
    },
    getOrderedRange(start,end){ const s=new Date(start.year,start.month,start.date); const e=new Date(end.year,end.month,end.date); return s<=e?[start,end]:[end,start] },
    markRangeAsSelected(start,end){ this.rangeSelectedDates=[]; const s=new Date(start.year,start.month,start.date); const e=new Date(end.year,end.month,end.date); let c=s; while(c<=e){ this.rangeSelectedDates.push({ date:c.getDate(), month:c.getMonth(), year:c.getFullYear() }); c.setDate(c.getDate()+1) } },
    getDateClass(day){
      const isInRange = this.rangeSelectedDates.some(d => d.date===day.date && d.month===this.month && d.year===this.year)
      return {
        'calendar-date--disabled': !day.isCurrentMonth,
        'calendar-date--today': day.isToday,
        'calendar-date--weekend': day.isWeekend,
        'calendar-date--selected': isInRange || (this.selectedDate && this.selectedDate.date===day.date && this.selectedDate.month===this.month && this.selectedDate.year===this.year),
        'calendar-date--highlighted': this.isHighlighted(day),
      }
    },
    isHighlighted(day){
      if(!day.date || !day.isCurrentMonth) return false
      const formattedDate = `${this.year}-${String(this.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
      return Array.isArray(this.indexMonth) && this.indexMonth.some(d => d.date === formattedDate)
    }
  },
  mounted(){ setTimeout(()=>{ const otherStore = container.resolve('otherStore'); this.highlightedDates = otherStore.get(this.highlightedDates) },250) }
}
</script>

<style scoped>
.calendarComponent-template {
  padding: 1rem;
  background: #f2f2f2;
  border: 1px dashed #999;
}
</style>

