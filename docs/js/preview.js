if (!turk.previewMode) {
  $("button").text("Start").click(function(e) {
    window.open("main.html",'_blank');
  }).attr("disabled", false);
}
