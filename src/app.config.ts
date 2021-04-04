import { AppConfig } from "remax/wechat";

const config: AppConfig = {
  pages: [
    'pages/landing/landing',
    'pages/index/index',
    'pages/book/index',
    'pages/auth/index',
    'pages/square/square',
    'pages/bind/index',
    'pages/hero/hero',
    'pages/user/user',
    'pages/clipping/clipping',
    'pages/search/search'
  ],

  window: {
    navigationStyle: 'custom',
    // navigationBarTitleText: 'Remax Wechat Template With TypeScript',
    // navigationBarBackgroundColor: '#282c34'
  },
  tabBar: {
    color: '#000000',
    selectedColor: '#2980b9',
    backgroundColor: '#ffffff',
    list: [{
      pagePath: 'pages/hero/hero',
      iconPath: '/assets/dashboard-ic.png',
      selectedIconPath: '/assets/dashboard-o-ic.png',
      text: '阅读记录'
    }, {
      pagePath: 'pages/square/square',
      iconPath: '/assets/baseline_explore_black_48dp.png',
      selectedIconPath: '/assets/baseline_explore_black_48dp.png',
      // selectedIconPath: '/assets/baseline_explore_white_48dp.png',
      text: '公共广场'
    }, {
      pagePath: 'pages/user/user',
      iconPath: '/assets/face-ic.png',
      selectedIconPath: '/assets/face-o-ic.png',
      text: '我的'
    }]
  },
};

export default config;
