<template>
  <div>
    <a-card class="card" title="收入" :bordered="false">
      <a-form :form="financialForm" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="财政补助收入">
              <a-input
                placeholder="请输入财政补助收入"
                v-decorator="[
                  'czbzsr',
                  {rules: [{ required: true, message: '请输入财政补助收入', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="8" :sm="24">
            <a-form-item
              label="财政拨入">
              <a-input
                placeholder="请输入财政拨入"
                v-decorator="[
                  'czbr',
                  {rules: [{ required: true, message: '请输入财政拨入', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item label="利息收入">
              <a-input
                placeholder="请输入利息收入"
                v-decorator="[
                  'lxsr',
                  {rules: [{ required: true, message: '请输入利息收入', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="捐赠收入">
              <a-input
                placeholder="请输入捐赠收入"
                v-decorator="[
                  'jzsr',
                  {rules: [{ required: true, message: '请输入捐赠收入', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="8" :sm="24">
            <a-form-item
              label="其他收入">
              <a-input
                placeholder="请输入其他收入"
                v-decorator="[
                  'qtsr',
                  {rules: [{ required: true, message: '请输入其他收入', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item
              label="借入款项">
              <a-input
                placeholder="请输入借入款项"
                v-decorator="[
                  'jrkx',
                  {rules: [{ required: true, message: '请输入借入款项', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card class="card" title="支出" :bordered="false">
      <a-form :form="financialForm" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="应付账款">
              <a-input
                placeholder="请输入应付账款"
                v-decorator="[
                  'yfzk',
                  {rules: [{ required: true, message: '请输入应付账款', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item
              label="其他应付款">
              <a-input
                placeholder="请输入其他应付款"
                v-decorator="[
                  'qtyfk',
                  {rules: [{ required: true, message: '请输入其他应付款', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 8}" :md="8" :sm="24">
            <a-form-item
              label="其他费用支出">
              <a-input
                placeholder="请输入其他费用支出"
                v-decorator="[
                  'qtfyzc',
                  {rules: [{ required: true, message: '请输入其他费用支出', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="事业支出">
              <a-input
                placeholder="请输入事业支出"
                v-decorator="[
                  'syzc',
                  {rules: [{ required: true, message: '请输入事业支出', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="工程施工费支出">
              <a-input
                placeholder="请输入工程施工费支出"
                v-decorator="[
                  'gcsgfyzc',
                  {rules: [{ required: true, message: '请输入工程施工费支出', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item
              label="设备购置费支出">
              <a-input
                placeholder="请输入设备购置费支出"
                v-decorator="[
                  'sbgzfzc',
                  {rules: [{ required: true, message: '请输入设备购置费支出', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card class="card" title="其他" :bordered="false">
      <a-form :form="financialForm" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="应收账款">
              <a-input
                placeholder="请输入应收账款"
                v-decorator="[
                  'yszk',
                  {rules: [{ required: false, message: '请输入应收账款', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 10}" :md="8" :sm="24">
            <a-form-item
              label="其他应收账款">
              <a-input
                placeholder="其他应收账款"
                v-decorator="[
                  'qtysk',
                  {rules: [{ required: false, message: '其他应收账款', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 9, offset: 1}" :lg="{span: 8}" :md="8" :sm="24">
            <a-form-item
              label="预付账款">
              <a-input
                placeholder="请输入预付账款"
                v-decorator="[
                  'yufzk',
                  {rules: [{ required: false, message: '请输入预付账款', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="6" :md="8" :sm="24">
            <a-form-item label="货币资金">
              <a-input
                placeholder="请输入货币资金"
                v-decorator="[
                  'hbzj',
                  {rules: [{ required: false, message: '请输入货币资金', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              label="竣工决算结余">
              <a-input
                placeholder="请输入竣工决算结余"
                v-decorator="[
                  'jgjsjy',
                  {rules: [{ required: false, message: '请输入竣工决算结余', whitespace: true}]}
                ]" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'FinancialStatements',
  data () {
    return {
      financialForm: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit (e) {
      this.financialForm.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
