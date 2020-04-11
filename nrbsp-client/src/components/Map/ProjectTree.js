import { Tree } from 'ant-design-vue'

export default {
  name: 'ProjectTree',
  props: Object.assign({}, Tree.props, {
    dataSource: {
      type: Array,
      required: true
    }
  }),
  data () {
    return {
    }
  },
  methods: {
    renderItem (item) {
      if (this.checkedKeys && this.checkedKeys.length && item.children && item.children) {
        const theIndex = this.checkedKeys.indexOf(item.bsm)
        if (theIndex > -1) {
          this.checkedKeys.splice(theIndex, 1)
        }
      }

      const childrenItems = item.children && item.children.map(o => {
        return this.renderItem(o)
      })

      return (
        <a-tree-node
          key={item.bsm}
          title = {item.treeName}
        >
          {childrenItems}
        </a-tree-node>
      )
    }
  },
  render () {
    const list = this.dataSource.map(item => {
      return this.renderItem(item)
    })

    const props = {}
    const localKeys = Object.keys(this.$data)

    Object.keys(Tree.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    return (
      <a-tree
        {...{ props, on: { check: (item) => this.$emit('check', item) } }}
      >
        {list}
      </a-tree>
    )
  }
}
