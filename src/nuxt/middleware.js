export default function({ route, $og, redirect }) {
  const auth = route.meta.reduce((auth, meta) => meta.auth || auth, false)
  if (!auth) {
    return
  }
  if (auth === 'guest' && !$og.auth.guest) {
    if (route.to !== '/') {
      redirect($og.get('AUTH_WEB_HOME', '/'))
    }
    return
  }

  if ((auth === 'protect' || auth === true) && $og.auth.guest) {
    redirect($og.get('AUTH_WEB_LOGIN', '/auth/login'))
  }
}
