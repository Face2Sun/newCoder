<template>
  <a-table
    ref="table"
    size="default"
    rowKey="id"
    :columns="columns"
    :dataSource="listData"
    showPagination="auto"
    :showHeader="false"
    style="background-color: #ffffff; margin-top: 20px;"
  >
    <template slot="title" slot-scope="currentPageData">
      <a-row>
        <a-col :md="16" :sm="24">
          <span class="xzsxfl-sl-numberTips">共 <span>{{ currentPageData.length }}</span> 个事项</span>
        </a-col>
        <a-col :md="8">
          <a-form layout="inline">
            <a-row type="flex" justify="end">
              <!-- <a-col :md="16" :sm="24"> -->
              <a-form-item>
                <a-input placeholder=""/>
              </a-form-item>
              <!-- </a-col> -->
              <a-form-item>
                <a-button type="primary">查询</a-button>
              </a-form-item>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
    </template>
    <span slot="action" slot-scope="record">
      <template>
        <a-button type="primary" @click="handleOnline(record)" ghost>在线办理</a-button>
        <a-divider type="vertical" />
        <a-button type="primary" @click="openGuide(record)" ghost>办理指南</a-button>
      </template>
    </span>
  </a-table>
</template>

<script>

export default {
  name: 'XzsxSlList',
  props: {
    listData: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      columns: [{
        // title: '流程名称',
        dataIndex: 'name'
      },
      {
        dataIndex: 'action',
        width: '300px',
        scopedSlots: { customRender: 'action' }
      }]
    }
  },
  mounted () {

  },
  methods: {
    handleOnline (rec) {

    },
    openGuide (rec) {

    }
  }
}
</script>

<style lang="less" scoped>

  // @import "../../../../src/components/index.less";

  .xzsxfl-sl-numberTips{
    display: inline-block;
    padding: 0px 20px;
    font-size: 18px;
    line-height: 40px;
    // span{
    //   color: @heading-color;
    // }
  }

</style>
