declare module '*.webp' {
  import type { ImageSourcePropType } from 'react-native';
  const source: ImageSourcePropType;
  export default source;
}

declare module 'react-native-web/dist/modules/AssetRegistry' {
  export type WebPackagerAsset = {
    httpServerLocation: string;
    name: string;
    type: string;
    scales: number[];
  };

  export function getAssetByID(assetId: number): WebPackagerAsset | undefined;
}

