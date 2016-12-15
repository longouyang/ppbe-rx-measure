var fingerprint;

// conservatively, just get the IP (should always work, as long as web.stanford.edu doesn't go down)
function setIp(ip) {
  console.log('set ip');
  fingerprint.ip = ip;

  // now, try to get more detailed geolocation info (will work if freegeoip is up and we haven't hit their limit)
  var isLocal = /file/.test(location.protocol);
  var protocol = isLocal ? "http://" : "//";

  var scriptEl = document.createElement('script');
  var src = protocol + "web.stanford.edu/~louyang/cgi-bin/locate.php?callback=setGeo";
  scriptEl.src = src;

  document.body.appendChild(scriptEl);
}

// try to get geo-located data
function setGeo(data) {
  console.log('set geo');
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
  var scriptEl = document.createElement('script');
  var protocol = isLocal ? "http://" : "//";
  var src = protocol + "web.stanford.edu/~louyang/cgi-bin/locate2.php?callback=setIp";
  scriptEl.src = src;


  document.body.appendChild(scriptEl);

})()
