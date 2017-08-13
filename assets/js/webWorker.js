(function() {
  "use srict";

  async function logFetch(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (err) {
      console.log('fetch failed', err);
    }
  }

  self.addEventListener('message', (e) => {
    console.log('Web Worker invoked with data', e.data);
    logFetch(e.data.url)
      .then((res) => self.postMessage(res));
  }, false);

}());
