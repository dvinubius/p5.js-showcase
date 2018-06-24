function load() {
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = function(){
      // remote script has loaded
      setup();
  };
  script.src = './4-map-color/sketch.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}