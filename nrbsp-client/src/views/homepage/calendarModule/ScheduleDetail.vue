<template>
  <a-modal
    title="日程新增"
    :visible="visible"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :width="700"
    :footer="null"
  >
    <div>
      <schedule-form ref="scheduleFrom" @redraw="redraw" @cancel="handleCancel"></schedule-form>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment'
import ScheduleForm from './ScheduleForm'
export default {
  components: {
    ScheduleForm
  },
  data () {
    return {
      visible: false,
      currentDate: {}
    }
  },
  methods: {
    showModal (parameter) {
      this.visible = true
      this.currentDate.kssj = moment(parameter, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
      // this.showDate()
    },
    // 将选择日期显示在新建日历框中---有问题
    // showDate () {
    //   setTimeout(() => {
    //     this.$nextTick(() => {
    //       console.log(this.$refs.scheduleForm)
    //       this.$refs.scheduleForm.showScheduleDetail(this.currentDate)
    //     })
    //   }, 1000)
    // },
    handleCancel () {
      this.visible = false
    },
    redraw () {
      this.$emit('redraw')
      this.visible = false
    }
  }
}
</script>

<style scoped>
</style>
