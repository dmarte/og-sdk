import Bootstrap from '../Sdk/Bootstrap'

export default ({ $config }, inject) => {
  const config = new Bootstrap($config.og || {})
  inject('og', config)
}
