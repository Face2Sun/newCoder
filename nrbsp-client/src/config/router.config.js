// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/home',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
          },
          // 外部链接
          {
            path: 'https://www.baidu.com/',
            name: 'Monitor',
            meta: { title: '监控页（外部）', target: '_blank' }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/dashboard/test-work',
            name: 'TestWork',
            component: () => import('@/views/dashboard/TestWork'),
            meta: { title: '测试功能', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },

      // Leaflet地图
      {
        path: '/mapview',
        redirect: '/mapview/home-view',
        component: PageView,
        meta: { title: '地图', icon: 'border-horizontal', permission: [ 'mapview' ] },
        children: [
          {
            path: '/mapview/home-view',
            name: 'HomeView',
            component: () => import('@/views/mapview/HomeView'),
            meta: { title: 'Leaflet地图例子', keepAlive: true, permission: [ 'mapview' ] }
          },
          {
            path: '/mapview/achieve-map',
            name: 'AchieveMap',
            component: () => import('@/views/mapview/AchieveMap'),
            meta: { title: 'Leaflet地图已完成控件', keepAlive: true, permission: [ 'mapview' ] }
          }
        ]
      },

      // 项目管理
      {
        path: '/system',
        redirect: '/system/project-management',
        component: PageView,
        meta: { title: '项目管理', icon: 'border-horizontal', permission: [ 'system' ] },
        children: [
          {
            path: '/system/project-management',
            name: 'ProjectManagement',
            component: () => import('@/views/system/ProjectManagement'),
            meta: { title: '项目管理', keepAlive: true, permission: [ 'system' ] }
          }
        ]
      },

      // 行政事项审批
      {
        path: '/xzsx',
        redirect: '/xzsx/sl/index',
        component: PageView,
        meta: { title: '行政事项', icon: 'border-horizontal', permission: [ 'xzsx' ] },
        children: [
          {
            path: '/xzsx/sl/index',
            name: 'XzsxSlIndex',
            component: () => import('@/views/xzsx/sl/Index'),
            meta: { title: '行政事项受理', keepAlive: true, permission: [ 'xzsx' ] }
          },
          {
            path: '/xzsx/sl/info',
            name: 'XzsxSlInfo',
            component: () => import('@/views/xzsx/sl/Info'),
            meta: { title: '行政事项办理', keepAlive: true, permission: [ 'xzsx' ] }
          }
        ]
      },

      // 流量指标
      {
        path: '/indicator',
        redirect: '/indicator/indicators-overview',
        component: PageView,
        meta: { title: '流量指标管理', icon: 'issues-close', permission: [ 'indicator' ] },
        children: [
          {
            path: '/indicator/indicators-overview',
            name: 'IndicatorsOverview',
            component: () => import('@/views/indicator/IndicatorsOverview'),
            meta: { title: '指标总览', keepAlive: true, permission: [ 'indicator' ] }
          },
          {
            path: '/indicator/indicators-new',
            name: 'IndicatorsNew',
            component: () => import('@/views/indicator/IndicatorsNew'),
            meta: { title: '指标新增', keepAlive: true, permission: [ 'indicator' ] }
          },
          {
            path: '/indicator/indicators-use',
            name: 'IndicatorsUse',
            component: () => import('@/views/indicator/IndicatorsUse'),
            meta: { title: '指标使用', keepAlive: true, permission: [ 'indicator' ] }
          }
        ]
      },
      // 统计分析
      {
        path: '/statistical',
        redirect: '/statistical/project-area',
        component: PageView,
        meta: { title: '统计分析', icon: 'pie-chart', permission: [ 'statistical' ] },
        children: [
          {
            path: '/statistical/project-area',
            name: 'ProjectArea',
            component: () => import('@/views/statistical/ProjectArea'),
            meta: { title: '项目区域统计', keepAlive: true, permission: [ 'statistical' ] }
          },
          {
            path: '/statistical/project-phases',
            name: 'ProjectPhases',
            component: () => import('@/views/statistical/ProjectPhases'),
            meta: { title: '项目阶段统计', keepAlive: true, permission: [ 'statistical' ] }
          },
          {
            path: '/statistical/project-inspect',
            name: 'ProjectInspect',
            component: () => import('@/views/statistical/ProjectInspect'),
            meta: { title: '项目巡查统计', keepAlive: true, permission: [ 'statistical' ] }
          },
          {
            path: '/statistical/project-cost',
            name: 'ProjectCost',
            component: () => import('@/views/statistical/ProjectCost'),
            meta: { title: '项目费用统计', keepAlive: true, permission: [ 'statistical' ] }
          },
          {
            path: '/statistical/new-indicators',
            name: 'NewIndicators',
            component: () => import('@/views/statistical/NewIndicators'),
            meta: { title: '新增指标统计', keepAlive: true, permission: [ 'statistical' ] }
          },
          {
            path: '/statistical/use-indicators',
            name: 'UseIndicators',
            component: () => import('@/views/statistical/UseIndicators'),
            meta: { title: '指标使用统计', keepAlive: true, permission: [ 'statistical' ] }
          }
        ]
      },
      // 信息公开中心
      {
        path: '/homepage',
        redirect: '/homepage/enter-page',
        component: PageView,
        meta: { title: '信息公开中心', icon: 'strikethrough', permission: [ 'homepage' ] },
        children: [
          {
            path: '/homepage/center-page',
            name: 'CenterPage',
            component: () => import('@/views/homepage/CenterPage'),
            meta: { title: '信息公开中心', keepAlive: true, permission: [ 'homepage' ] }
          },
          {
            path: '/homepage/information-subpage',
            name: 'InformationSubpage',
            component: () => import('@/views/homepage/InformationSubpage'),
            meta: { title: '信息子页面', keepAlive: true, permission: [ 'homepage' ] }
          },
          {
            path: '/homepage/details-subpage',
            name: 'DetailsSubpage',
            component: () => import('@/views/homepage/DetailsSubpage'),
            meta: { title: '详情子页面', keepAlive: true, permission: [ 'homepage' ] }
          },
          {
            path: '/homepage/schedule-subpage',
            name: 'ScheduleSubpage',
            component: () => import('@/views/homepage/ScheduleSubpage'),
            meta: { title: '日程页面', keepAlive: true, permission: [ 'homepage' ] }
          }
        ]
      },

      // 行政事项处理
      {
        path: '/administrative',
        redirect: '/administrative/matters-accept',
        component: PageView,
        meta: { title: '一体化政务服务', icon: 'interation', permission: [ 'administrative' ] },
        children: [
          {
            path: '/administrative/matters-accept',
            name: 'MattersAccept',
            component: () => import('@/views/administrative/MattersAccept'),
            meta: { title: '行政事项受理', keepAlive: true, permission: [ 'administrative' ] }
          },
          {
            path: '/administrative/accept-maintain',
            name: 'AcceptMaintain',
            component: () => import('@/views/administrative/AcceptMaintain'),
            meta: { title: '行政事项受理维护', keepAlive: true, permission: [ 'administrative' ] }
          }
        ]
      },

      // 后台管理
      {
        path: '/background',
        component: PageView,
        redirect: '/background/news',
        meta: { title: '后台管理', icon: 'tool', permission: [ 'news' ] },
        children: [
          {
            path: '/background/news',
            name: 'News',
            component: RouteView,
            // component: () => import('@/views/background/news/NewsCategory'),
            redirect: '/background/news/news-category',
            meta: { title: '新闻中心', permission: [ 'news' ] },
            children: [
              {
                path: '/background/news/news-category',
                name: 'NewsCategory',
                component: () => import('@/views/background/news/NewsCategory'),
                meta: { title: '新闻栏目', permission: [ 'news' ] }
              },
              {
                path: '/background/news/news-releases',
                name: 'NewsReleases',
                component: () => import('@/views/background/news/NewsReleases'),
                meta: { title: '新闻发布', permission: [ 'news' ] }
              },
              {
                path: '/background/news/news-parameter',
                name: 'NewsParameter',
                component: () => import('@/views/background/news/NewsParameter'),
                meta: { title: '新闻台账', permission: [ 'background' ] }
              },
              {
                path: '/background/news/news-drafts',
                name: 'NewsDrafts',
                component: () => import('@/views/background/news/NewsDrafts'),
                meta: { title: '草稿箱', permission: [ 'background' ] }
              },
              {
                path: '/background/news/waiting-review',
                name: 'WaitingReview',
                component: () => import('@/views/background/news/WaitingReview'),
                meta: { title: '待审核', permission: [ 'background' ] }
              }
            ]
          }
        ]
      },

      // forms
      {
        path: '/form',
        redirect: '/form/base-form',
        component: PageView,
        meta: { title: '表单页', icon: 'form', permission: [ 'form' ] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/BasicForm'),
            meta: { title: '基础表单', keepAlive: true, permission: [ 'form' ] }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: '分步表单', keepAlive: true, permission: [ 'form' ] }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: '高级表单', keepAlive: true, permission: [ 'form' ] }
          }
        ]
      },

      // list
      {
        path: '/list',
        name: 'list',
        component: PageView,
        redirect: '/list/table-list',
        meta: { title: '列表页', icon: 'table', permission: [ 'table' ] },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: '查询表格', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/StandardList'),
            meta: { title: '标准列表', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: '卡片列表', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: '搜索列表', keepAlive: true, permission: [ 'table' ] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: '搜索列表（文章）', permission: [ 'table' ] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/search/Projects'),
                meta: { title: '搜索列表（项目）', permission: [ 'table' ] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/search/Applications'),
                meta: { title: '搜索列表（应用）', permission: [ 'table' ] }
              }
            ]
          }
        ]
      },

      // profile
      {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: '详情页', icon: 'profile', permission: [ 'profile' ] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic/Index'),
            meta: { title: '基础详情页', permission: [ 'profile' ] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '高级详情页', permission: [ 'profile' ] }
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'result' ] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'exception' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'exception' ] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'exception' ] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center/Index'),
            meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', permission: [ 'user' ] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', keepAlive: true, permission: [ 'user' ] }
              }
            ]
          }
        ]
      },

      // other
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/homepage/Home')
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
