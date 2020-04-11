<template>
  <div>
    <a-modal
      title="日程管理"
      :destroyOnClose="true"
      :visible="visible"
      :width="700"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-tabs @change="callback" :activeKey="activeKey">
        <a-tab-pane tab="日程列表" key="1">
          <a-list itemLayout="horizontal" :dataSource="scheduleList">
            <a-list-item slot="renderItem" slot-scope="item">
              <a href="javascript:;" @click="editorSchedule(item)">
                <a-list-item-meta :description="item.nr">
                  <span slot="title">{{ item.bt }}</span>
                  <div slot="avatar" class="avatar-time">
                    <span>{{ item.kssj | time }}</span>
                  </div>
                </a-list-item-meta>
              </a>
              <div class="list-right">
                <a href="javascript:;" @click="editorSchedule(item)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定删除吗?" @confirm="deleteSchedule(item)">
                  <a>删除</a>
                </a-popconfirm>
              </div>
            </a-list-item>
          </a-list>
        </a-tab-pane>
        <a-tab-pane tab="日程详细" key="2">
          <schedule-form ref="scheduleForm" @tabsHome="tabsHome"></schedule-form>
        </a-tab-pane>
        <a-button type="primary" ghost icon="plus" slot="tabBarExtraContent" @click="addSchedule">新建</a-button>
      </a-tabs>
    </a-modal>
    <schedule-detail ref="scheduleDetail" @redraw="redraw"></schedule-detail>
  </div>
</template>
<script>
import { findByDate, deleteDateCanlendar } from '@/api/calendar'
import ScheduleForm from './ScheduleForm'
import ScheduleDetail from './ScheduleDetail'
export default {
  components: {
    ScheduleForm,
    ScheduleDetail
  },
  data () {
    return {
      visible: false,
      selectDate: '',
      activeKey: '1',
      scheduleList: []
    }
  },
  created () {
  },
  mounted () {
  },
  filters: {
    time: (value) => {
      if (!value) return ''
      return value.substring(11, 16)
    }
  },
  methods: {
    showModal (date) {
      this.visible = true
      this.selectDate = date
      this.activeKey = '1'
      this.loadData(date)
    },
    handleCancel () {
      this.visible = false
    },
    loadData (date) {
      findByDate(date).then(res => {
        if (res.success && res.code === 200) {
          this.scheduleList = res.data
        } else {
          this.$message.error('失败')
        }
      })
    },
    editorSchedule (item) {
      console.log(item)
      this.activeKey = '2'
      this.$nextTick(() => {
        this.$refs.scheduleForm.showScheduleDetail(item)
      })
    },
    deleteSchedule (item) {
      deleteDateCanlendar(item.id).then(res => {
        if (res.success && res.code === 200) {
          this.$message.success('删除成功')
          this.loadData(this.selectDate)
          setTimeout(() => {
            if (this.scheduleList.length === 0) {
              this.visible = false
            }
          }, 300)
          this.$emit('redraw')
        } else {
          this.$message.error('失败')
        }
      })
    },
    callback (key) {
      this.activeKey = key
      if (key === '2') {
        this.$nextTick(() => {
          if (!this.$refs.scheduleForm.id) {
            if (this.scheduleList.length > 0) {
              this.$refs.scheduleForm.showScheduleDetail(this.scheduleList[0])
            }
          }
        })
      }
    },
    addSchedule () {
      this.visible = false
      this.$nextTick(() => {
        this.$refs.scheduleDetail.showModal(this.selectDate)
      })
    },
    redraw () {
      this.$emit('redraw')
    },
    tabsHome () {
      this.activeKey = '1'
      this.loadData(this.selectDate)
      this.$emit('redraw')
    }
  }
}
</script>
<style scoped>
/* 日程列表系统样式修改 */
.ant-list-item-meta-avatar {
  margin: 5px 15px 0 0;
}
.avatar-time {
  width: 45px;
  height: 45px;
  color: #fff;
  font-size: 16px;
  text-align: center;
  border-radius: 50%;
  line-height: 45px;
  background-color: #ccc;
}
.ant-divider-vertical {
  top: 5px;
  margin: 0 10px;
}
.ant-list-item-meta-description {
  width: 500px;
}
.ant-divider-vertical[data-v-4deac9f8] {
  top: 0px;
  margin: 0 10px;
}
.list-right{
 padding-top: 15px;
}
</style>
