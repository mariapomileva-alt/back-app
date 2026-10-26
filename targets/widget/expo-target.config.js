/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'widget',
  name: 'BackWidget',
  displayName: 'Back',
  deploymentTarget: '17.0',
  bundleIdentifier: '.BackWidget',
  icon: '../../assets/images/icon.png',
  colors: {
    $widgetBackground: '#F3EDE1',
    $accent: '#315E4D',
    Forest: '#0C3B2E',
    Sage: '#315E4D',
  },
  frameworks: ['WidgetKit', 'SwiftUI', 'AppIntents'],
};
