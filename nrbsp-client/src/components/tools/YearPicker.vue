<template>
  <a-date-picker
    placeholder="输入年份"
    format="YYYY"
    mode="year"
    style="width: 120px"
    :value="value"
    :open="isopen"
    @openChange="handleOpenChange"
    @panelChange="handlePanelChange"
    @change="handleChange"
  />
</template>
<script>
export default {
  data () {
    return {
      value: null,
      isopen: false
    }
  },
  methods: {
    handleChange () {
      this.value = null
    },
    handleOpenChange () {
      if (this.isopen) {
        this.isopen = false
      } else {
        this.isopen = true
      }
    },
    handlePanelChange (value) {
      this.value = value
      this.isopen = false
    },
    selectDate () {
      if (this.value) {
        return this.value.format('YYYY-MM-DD')
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>
</style>
