(function() {
  "use srict";

  self.addEventListener('message', (e) => {
    console.log('Web Worker invoked with data', e.data);
    fetch(e.data.url)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        self.postMessage(res);
      })
  }, false);

}());
