<!-- components/ratingStarComponent/ratingStarComponent.vue -->
<template lang="pug">
em.rating-stars(role="radiogroup")
  i.star(
    v-for="star in stars"
    :key="star"
    :class="{ filled: isFilled(star) }"
    @click="setRating(star)"
    @mouseover="highlight(star)"
    @mouseleave="resetHighlight"
    role="radio"
    :aria-checked="isFilled(star)"
    tabindex="0"
    aria-label="評分星等"
  ) ★
</template>

<script>
export default {
  name: 'ratingStarComponent',
  props: { score: { type:Number, default:0 }, max: { type:Number, default:5 } },
  emits: ['update:score'],
  data(){ return { currentScore: this.score, hoverScore: 0 } },
  computed: { stars(){ return Array.from({length:this.max}, (_,i)=>i+1) } },
  watch: { score(newVal){ this.currentScore = newVal } },
  methods: {
    setRating(v){ this.currentScore=v; this.$emit('update:score', v) },
    highlight(v){ this.hoverScore=v },
    resetHighlight(){ this.hoverScore=0 },
    isFilled(i){ return this.hoverScore ? i<=this.hoverScore : i<=this.currentScore }
  }
}
</script>

<style scoped>
.ratingStarComponent-template { padding: 1rem; background: #f2f2f2; border: 1px dashed #999; }
.rating-stars { display: flex; gap: .25rem; font-size: 1rem; cursor: pointer; }
.star { color: #ccc; transition: color .2s }
.star.filled { color: #ffc107 }
</style>

