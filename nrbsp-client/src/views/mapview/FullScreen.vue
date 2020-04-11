<template>
  <div class="leaflet-control-fullscreen leaflet-bar" ref="container">
    <a href="#" class="leaflet-control-fullscreen-button leaflet-bar-part" @click="fullscreenchange" ref="link"></a>
  </div>
</template>

<script>
import L from 'leaflet'
export default {
  components: {
  },
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      title: {
        'false': '全屏显示',
        'true': '退出全屏'
      },
      isFullscreen: false,
      fullscreenControl: false
    }
  },
  mounted () {
    this._toggleTitle()
    this.addInitHook()
    // console.log(document.fullscreenElement)
  },
  methods: {
    // 设置按键提示
    _toggleTitle () {
      this.$refs.link.title = this.title[this.isFullscreen]
    },
    // 全屏按钮的切换事件
    fullscreenchange () {
      var container = this.$refs.container
      var conta = this.map.$el
      if (this.isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this._disablePseudoFullscreen(container)
      } else {
        if (conta.requestFullscreen) {
          conta.requestFullscreen()
        } else if (conta.mozRequestFullScreen) {
          conta.mozRequestFullScreen()
        } else if (conta.webkitRequestFullscreen) {
          conta.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        } else if (conta.msRequestFullscreen) {
          conta.msRequestFullscreen()
        }
        this._enablePseudoFullscreen(conta)
      }
      this._toggleTitle()
    },
    // 全屏状态下的样式更改
    _enablePseudoFullscreen (container) {
      L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen')
      this._setFullscreen(true)
    },
    // 恢复正常时的样式更改
    _disablePseudoFullscreen (container) {
      L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen')
      this._setFullscreen(false)
    },
    // 样式更改方法
    _setFullscreen (fullscreen) {
      this.isFullscreen = fullscreen
      var container = this.$refs.container
      if (fullscreen) {
        L.DomUtil.addClass(container, 'leaflet-fullscreen-on')
        L.DomUtil.removeClass(container, 'leaflet-control-fullscreen')
        L.DomUtil.addClass(container, 'leaflet-control-fullscreen1')
      } else {
        L.DomUtil.removeClass(container, 'leaflet-fullscreen-on')
        L.DomUtil.removeClass(container, 'leaflet-control-fullscreen1')
        L.DomUtil.addClass(container, 'leaflet-control-fullscreen')
      }
    },
    _onFullscreenChange () {
      var fullscreenElement =
                document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement

      if (fullscreenElement === this.$refs.container && !this.isFullscreen) {
        this._setFullscreen(true)
      } else if (fullscreenElement !== this.$refs.container && this.isFullscreen) {
        this._setFullscreen(false)
      }
    },
    addInitHook () {
      if (this.fullscreenControl) {
        this.fullscreenControl = new L.Control.Fullscreen(this.fullscreenControl)
        this.addControl(this.fullscreenControl)
      }

      var fullscreenchange

      if ('onfullscreenchange' in document) {
        fullscreenchange = 'fullscreenchange'
      } else if ('onmozfullscreenchange' in document) {
        fullscreenchange = 'mozfullscreenchange'
      } else if ('onwebkitfullscreenchange' in document) {
        fullscreenchange = 'webkitfullscreenchange'
      } else if ('onmsfullscreenchange' in document) {
        fullscreenchange = 'MSFullscreenChange'
      }

      this.whenReady = (function () {		// 这个函数返回whenReady（）函数
        var funcs = []				// 当获得事件时，要运行的函数
        var ready = false			// 当触发事件处理程序时，切换到true

        // 当文档准备就绪时，调用事件处理程序
        function handler (e) {
          // 如果已经运行过一次，只需要放回
          if (ready) { return }

          // 如果发生readystatechange事件
          // 但其状态不是“complete”的话，那么文档尚未准备好
          if (e.type === 'readystatechange' && document.readyState !== 'complete') { return }
          // 运行所有注册函数
          // 注意每次都要计算funcs.length
          // 以防这些函数调用可能会导致注册更多的函数
          for (var i = 0; i < funcs.length; i++) { funcs[i].call(document) }

          // 现在设置ready标识为true，并移除所有函数
          ready = true
          funcs = null
        }

        // 为接收到的任何事件注册处理程序
        if (document.addEventListener) {
          document.addEventListener('DOMContentLoaded', handler, false)
          document.addEventListener('readystatechange', handler, false)
          window.addEventListener('load', handler, false)
        } else if (document.attachEvent) {
          document.attachEvent('onreadystatechange', handler)
          window.attachEvent('onload', handler)
        }

        // 返回whenReady()函数
        return function whenReady (f) {
          if (ready) {
            f.call(document)
          } else {
            funcs.push(f)
          }		// 否则，加入队列等候
        }
      }())

      // var _this = this
      // console.log(this)
      // this.on = function (evt, cls, fn) {
      //   _this.addEventListener(evt, function (event) {
      //     if (event.target.classList.contains(cls)) {
      //       // 使回调函数this指向的是class=focus的元素
      //       fn.call(event.target, event)
      //     }
      //   })
      // }

      if (fullscreenchange) {
        var onFullscreenChange = L.bind(this._onFullscreenChange, this)

        this.whenReady(function () {
          L.DomEvent.on(document, fullscreenchange, onFullscreenChange)
        })

        this.on('unload', function () {
          L.DomEvent.off(document, fullscreenchange, onFullscreenChange)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.leaflet-control-fullscreen a {
  background:#fff url(~@/static/images/fullscreen/fullscreen.png) no-repeat 0 0;
  background-size:26px 52px;
  }
.leaflet-control-fullscreen1 a {
  background:#fff url(~@/static/images/fullscreen/fullscreen.png) no-repeat 0 100%;
  background-size:26px 52px;
  }
.leaflet-touch .leaflet-control-fullscreen a {
    background-position: 2px 2px;
    }
.leaflet-fullscreen-on .leaflet-control-fullscreen a {
    background-position:0 -26px;
    }
.leaflet-touch.leaflet-fullscreen-on .leaflet-control-fullscreen a {
    background-position: 2px -24px;
    }

/* Do not combine these two rules; IE will break. */
.leaflet-container:-webkit-full-screen {
  width:100%!important;
  height:100%!important;
  }
.leaflet-container.leaflet-fullscreen-on {
  width:100%!important;
  height:100%!important;
  }

.leaflet-pseudo-fullscreen {
  position:fixed!important;
  width:100%!important;
  height:100%!important;
  top:0!important;
  left:0!important;
  z-index:99;
  }

</style>
