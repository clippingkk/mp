export default {
  pages: [
    'pages/landing/landing',
    'pages/index/index',
    'pages/book/index',
    'pages/auth/index',
    'pages/bind/index',
    'pages/hero/hero',
    'pages/user/user',
    'pages/clipping/clipping',
    'pages/search/search'
  ],
  tabBar: {
    color: '#000000',
    selectedColor: '#2980b9',
    backgroundColor: '#ffffff',
    list: [{
      pagePath: 'pages/hero/hero',
      iconPath: './assets/dashboard-ic.png',
      selectedIconPath: './assets/dashboard-o-ic.png',
      text: 'square'
    }, {
      pagePath: 'pages/user/user',
      iconPath: './assets/face-ic.png',
      selectedIconPath: './assets/face-o-ic.png',
      text: 'user'
    }]
  },
  window: {
    navigationStyle: 'custom',
  }
}
