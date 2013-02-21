({
  appDir: 'www',
  dir: 'www-built',
  baseUrl: '.',
  fileExclusionRegExp: /(^example)|(.git)$/,
  map: {
    '*': {
      amdquery: '../../amdquery',
      is: 'require-is/is'
    }
  },
  modules: [
    {
      name: 'app',
    }
  ],
  config: {
    is: {
      mobile: false,
    }
  }
})
