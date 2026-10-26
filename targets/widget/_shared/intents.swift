import AppIntents
import SwiftUI
import WidgetKit

struct OpenBackIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Back"
  static var description = IntentDescription("Open Back")
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult & OpensIntent {
    .result(opensIntent: OpenURLIntent(URL(string: "back:///")!))
  }
}

struct StartBreathingIntent: AppIntent {
  static var title: LocalizedStringResource = "Start breathing"
  static var description = IntentDescription("Start a breathing session in Back")
  static var openAppWhenRun: Bool = true

  func perform() async throws -> some IntentResult & OpensIntent {
    .result(opensIntent: OpenURLIntent(URL(string: "back:///breathe")!))
  }
}

struct BackShortcuts: AppShortcutsProvider {
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: OpenBackIntent(),
      phrases: [
        "Open \(.applicationName)",
        "Open Back",
      ],
      shortTitle: "Open Back",
      systemImageName: "circle"
    )
    AppShortcut(
      intent: StartBreathingIntent(),
      phrases: [
        "Start breathing in \(.applicationName)",
        "Start breathing with Back",
        "Breathe with \(.applicationName)",
      ],
      shortTitle: "Start breathing",
      systemImageName: "wind"
    )
  }
}

@available(iOS 18.0, *)
struct BackControl: ControlWidget {
  static let kind = "app.back.selfhelp.control.breathe"

  var body: some ControlWidgetConfiguration {
    StaticControlConfiguration(kind: Self.kind) {
      ControlWidgetButton(action: StartBreathingControlIntent()) {
        Label("Breathe", systemImage: "wind")
      }
    }
    .displayName("Breathe")
    .description("Open Back and start breathing.")
  }
}

@available(iOS 18.0, *)
struct StartBreathingControlIntent: ControlConfigurationIntent {
  static let title: LocalizedStringResource = "Start breathing"
  static let description = IntentDescription("Open Back and start breathing.")
  static let isDiscoverable = true
  static let openAppWhenRun: Bool = true

  @MainActor
  func perform() async throws -> some IntentResult & OpensIntent {
    .result(opensIntent: OpenURLIntent(URL(string: "back:///breathe")!))
  }
}
