(function () {
  var config = window.BACK_PLUS_SITE || { subscriptionsPubliclyAvailable: false };
  if (!config.subscriptionsPubliclyAvailable) {
    return;
  }
  var root = document.getElementById('back-plus-live');
  if (!root || !window.BACK_PLUS_FUTURE_HTML) {
    return;
  }
  root.innerHTML = window.BACK_PLUS_FUTURE_HTML;
  root.hidden = false;
})();
