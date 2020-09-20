import path from 'path'

export default function(options) {
  const settings = Object.assign(
    {
      API_URL: process.env.OG_SDK_URL_API || '/',
      URL_LOGIN: process.env.OG_SDK_URL_LOGIN || 'auth/login',
      URL_USER: process.env.OG_SDK_URL_USER || 'users/current'
    },
    this.options.ogsdk,
    options
  )
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: settings
  })
}
