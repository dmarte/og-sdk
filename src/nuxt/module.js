import path from 'path'

export default function(options) {
  const settings = Object.assign({}, this.options.ogsdk, options)
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: settings
  })
}
