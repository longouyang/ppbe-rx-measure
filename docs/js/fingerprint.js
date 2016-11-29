var fingerprint;

function setGeo(data) {
  fingerprint.ip = data.ip;
  fingerprint.geo = data;
}

(function() {

  var ua = navigator.userAgent,
      browser = typeof bowser !== 'undefined' ? bowser._detect(ua) : ua;

  var plugins = Array.prototype.slice.call(navigator.plugins).map(
    function(x) {
      return {filename: x.filename, description: x.description}
    });

  fingerprint = {
    browser: browser,
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
    ip: "",
    geo: "",
    timezone: new Date().getTimezoneOffset(),
    plugins: plugins
  }

  var isLocal = /file/.test(location.protocol);

  // inject a call to a json service that will give us geolocation information
  var protocol = isLocal ? "http://" : "//";
  var src = protocol + "freegeoip.net/json/?callback=setGeo";

  var scriptEl = document.createElement('script');
  scriptEl.src = protocol + "freegeoip.net/json/?callback=setGeo";

  document.body.appendChild(scriptEl);

})()
