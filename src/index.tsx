import { NativeModules, Platform } from 'react-native';

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | BigInt64Array
  | BigUint64Array;

const LINKING_ERROR =
  `The package 'react-native-random-values-jsi-helper' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const RandomValuesJsiHelper = NativeModules.RandomValuesJsiHelper
  ? NativeModules.RandomValuesJsiHelper
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

RandomValuesJsiHelper.install();

// @ts-expect-error
if (typeof global.crypto !== 'object') {
  // @ts-ignore
  global.crypto = {};
}
// @ts-expect-error
global.crypto.getRandomValues = (array: TypedArray) => {
  // @ts-expect-error
  const values = global.getRandomValues(array.byteLength);
  array.forEach((_, i: number) => {
    array[i] = values[i];
  });
  return values;
};
