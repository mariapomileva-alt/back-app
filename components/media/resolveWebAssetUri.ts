import { PixelRatio, type ImageSourcePropType } from 'react-native';
import { getAssetByID } from 'react-native-web/dist/modules/AssetRegistry';

const svgDataUriPattern = /^(data:image\/svg\+xml;utf8,)(.*)/;

/** Same URI rules as react-native-web Image (bundled requires on Expo web). */
export function resolveWebAssetUri(source: ImageSourcePropType): string | null {
  let uri: string | null = null;

  if (typeof source === 'number') {
    const asset = getAssetByID(source);
    if (asset == null) {
      return null;
    }
    let scale = asset.scales[0];
    if (asset.scales.length > 1) {
      const preferredScale = PixelRatio.get();
      scale = asset.scales.reduce((prev: number, curr: number) =>
        Math.abs(curr - preferredScale) < Math.abs(prev - preferredScale) ? curr : prev,
      );
    }
    const scaleSuffix = scale !== 1 ? `@${scale}x` : '';
    uri = `${asset.httpServerLocation}/${asset.name}${scaleSuffix}.${asset.type}`;
  } else if (typeof source === 'string') {
    uri = source;
  } else if (source && typeof source === 'object' && !Array.isArray(source) && typeof source.uri === 'string') {
    uri = source.uri;
  }

  if (uri) {
    const match = uri.match(svgDataUriPattern);
    if (match && match[2] != null) {
      return `${match[1]}${encodeURIComponent(match[2])}`;
    }
  }

  return uri;
}
