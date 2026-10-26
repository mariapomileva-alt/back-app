import SwiftUI
import WidgetKit

@main
struct BackWidgets: WidgetBundle {
  var body: some Widget {
    BackHomeWidget()
    if #available(iOSApplicationExtension 18.0, *) {
      BackControl()
    }
  }
}
