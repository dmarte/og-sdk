import Bootstrap from '~/plugins/sdk/src/Sdk/Bootstrap'

export default (context, inject) => {
  inject('og', new Bootstrap(<%=JSON.stringify(options)%>))
}
