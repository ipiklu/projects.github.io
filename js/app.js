if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Ready!'))
      .catch(err => console.log('PWA Failed', err));
  });
}