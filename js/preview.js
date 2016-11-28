/* global $, bowser */
if (bowser.chrome) {
  // HT http://stackoverflow.com/a/4900484/351329
  var majorVersion = parseInt(bowser.version, 10);
  if (majorVersion < 40) {
    $("#browser-info").html("<span style='color: red'>&#10008;</span> Your version of Chrome (" + majorVersion + ") is too old.");
    if (!turk.previewMode) {
     $("button").text("Upgrade Chrome to begin");
    }
  } else {
    $("#browser-info").html("<span style='color: green'>&#10003;</span> You are using Chrome <b>" + majorVersion + "</b>.");
    if (!turk.previewMode) {
      $("button").text("Start").click(function(e) {
        window.open("main.html",'_blank');
      }).attr("disabled", false);
    }
  }
} else {
  $("#browser-info").html("<span style='color: red'>&#10008;</span> You are using  <b>" + bowser.name + (" " + bowser.version)  + "</b>.");
  if (!turk.previewMode) {
    $("button").text("Switch to Chrome to begin");
  }
}
$("#browser-info").removeClass("hide");
