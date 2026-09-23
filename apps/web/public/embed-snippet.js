/**
 * Steelyes configurator iframe embed helper.
 * Usage:
 * <div id="steelyes-configurator"></div>
 * <script src="https://www.steelyes.co.uk/embed-snippet.js" data-tenant="steelyes"></script>
 */
(function embedSteelyesConfigurator() {
  var script = document.currentScript
  if (!script) return

  var tenant = script.getAttribute('data-tenant') || 'steelyes'
  var host = script.getAttribute('data-host') || 'https://www.steelyes.co.uk'
  var targetId = script.getAttribute('data-target') || 'steelyes-configurator'
  var container = document.getElementById(targetId)

  if (!container) {
    console.warn('[Steelyes embed] Missing container #' + targetId)
    return
  }

  var iframe = document.createElement('iframe')
  iframe.src = host.replace(/\/$/, '') + '/embed/configurator?tenant=' + encodeURIComponent(tenant)
  iframe.title = 'Gate configurator'
  iframe.loading = 'lazy'
  iframe.style.width = '100%'
  iframe.style.minHeight = '820px'
  iframe.style.border = '0'
  iframe.style.borderRadius = '16px'
  iframe.allow = 'clipboard-write'
  container.replaceChildren(iframe)

  var hostOrigin
  try {
    hostOrigin = new URL(host).origin
  } catch (error) {
    hostOrigin = null
  }

  window.addEventListener('message', function (event) {
    // Only accept resize messages from our own iframe, on our own origin, within sane bounds.
    if (event.origin !== hostOrigin || event.source !== iframe.contentWindow) return
    if (event.data && event.data.type === 'steelyes:configurator:resize' && typeof event.data.height === 'number') {
      iframe.style.height = Math.min(Math.max(event.data.height, 400), 6000) + 'px'
    }
  })
})()
