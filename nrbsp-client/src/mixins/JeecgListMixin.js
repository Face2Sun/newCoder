import Vue from 'vue'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

export const JeecgListMixin = {
  data() {
    return {
      projectDataSource: [],
      columns: [{
        title: '项目名称',
        dataIndex: 'xmmc',
        align: 'center',
        width: '25%'
      },
      {
        title: '土地坐落',
        dataIndex: 'tdzl',
        width: '20%'
      },
      {
        title: '实施单位',
        dataIndex: 'ssdw',
        width: '20%'
      },
      {
        title: '开始时间',
        dataIndex: 'xmkssj',
        width: '10%',
        //sorter: true,
        //render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>
      },
      {
        title: '项目状态',
        dataIndex: 'xmzt',
        width: '10%'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '20%',
        scopedSlots: {
          customRender: 'operation'
        }
      }
      ],
      queryParam: {
        pcmc: '', // 批次名称
        beginDate: '', // 开始时间
        endDate: '', // 结束时间
        pageNo: 1,
        pageSize: 100
      },
      mode: ['month', 'month'],
      value: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 获取服务器数据的方法
    loadData() {
      this.loading = true; //出现加载圈圈
      this.projectDataSource = [];
      const params = {
        pageNo: 1,
        pageSize: 100
      };
      getProjectInfo(params).then(res => {
        if (res.success) {
          this.projectDataSource = res.data.list;
          //this.ipagination.total = parseInt(res.data.total)
          this.loading = false;
          console.log(this.projectDataSource)
        } else {
          this.$message.error('数据获取失败')
        }
      });
    }
  }

}