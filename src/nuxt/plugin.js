import Bootstrap from '../Sdk/Bootstrap'

export default (context, inject) => {
  inject('og', new Bootstrap(<%=JSON.stringify(options)%>))
}
