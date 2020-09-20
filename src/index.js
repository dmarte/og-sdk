import App from './Sdk/Odontogo'

export default {
  install(vue) {
    vue.prototype.$og = new App()
  }
}
