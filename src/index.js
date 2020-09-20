import Odontogo from './Sdk/Odontogo'

export default {
  install(vue) {
    vue.prototype.$ogo = new Odontogo()
  }
}
