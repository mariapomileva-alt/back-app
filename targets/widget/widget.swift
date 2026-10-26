import SwiftUI
import WidgetKit

struct BackEntry: TimelineEntry {
  let date: Date
}

struct BackProvider: TimelineProvider {
  func placeholder(in context: Context) -> BackEntry {
    BackEntry(date: Date())
  }

  func getSnapshot(in context: Context, completion: @escaping (BackEntry) -> Void) {
    completion(BackEntry(date: Date()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<BackEntry>) -> Void) {
    completion(Timeline(entries: [BackEntry(date: Date())], policy: .never))
  }
}

struct BackHomeWidget: Widget {
  let kind = "BackHomeWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BackProvider()) { _ in
      BackWidgetView()
        .containerBackground(for: .widget) {
          Color("WidgetBackground")
        }
        .widgetURL(URL(string: "back:///breathe"))
    }
    .configurationDisplayName("Back")
    .description("Open Back and start breathing in one tap.")
    .supportedFamilies([
      .systemSmall,
      .accessoryCircular,
      .accessoryRectangular,
      .accessoryInline,
    ])
  }
}

struct BackWidgetView: View {
  @Environment(\.widgetFamily) private var family

  var body: some View {
    switch family {
    case .accessoryCircular:
      Text("Back")
        .font(.caption.weight(.semibold))
        .minimumScaleFactor(0.6)
        .multilineTextAlignment(.center)
    case .accessoryInline:
      Text("Back · Breathe")
    case .accessoryRectangular:
      VStack(alignment: .leading, spacing: 2) {
        Text("You’re here.")
          .font(.headline)
        Text("Breathe")
          .font(.subheadline)
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    default:
      VStack(alignment: .leading, spacing: 8) {
        Text("You’re here.")
          .font(.title3.weight(.medium))
          .foregroundStyle(Color("Forest"))
        Text("Breathe")
          .font(.body)
          .foregroundStyle(Color("Sage"))
        Spacer(minLength: 0)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
  }
}
