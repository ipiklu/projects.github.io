if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(reg => console.log('PWA Ready! Scope is: ', reg.scope))
      .catch(err => console.log('PWA Failed', err));
  });
}