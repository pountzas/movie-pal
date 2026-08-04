declare module "react-native-reanimated" {
  import type { ComponentType } from "react";
  import type { ScrollViewProps, ViewProps } from "react-native";

  export function useSharedValue<T>(initialValue: T): { value: T };
  export function useAnimatedStyle<T extends object>(updater: () => T): T;
  export function withSpring<T>(
    toValue: T,
    config?: object,
    callback?: (finished?: boolean) => void
  ): T;

  const Animated: {
    View: ComponentType<ViewProps & { className?: string }>;
    ScrollView: ComponentType<ScrollViewProps & { className?: string }>;
  };

  export default Animated;
}

declare module "react-native-gesture-handler" {
  import type { ComponentType, PropsWithChildren, ReactNode } from "react";
  import type { StyleProp, ViewStyle } from "react-native";
  type PanEvent = {
    x: number;
    translationX: number;
    translationY: number;
    velocityY: number;
  };
  type PanConfig = {
    activeOffsetX(offset: number | number[]): PanConfig;
    failOffsetY(offset: number | number[]): PanConfig;
    onBegin(cb: (event: PanEvent) => void): PanConfig;
    onUpdate(cb: (event: PanEvent) => void): PanConfig;
    onEnd(cb: (event: PanEvent) => void): PanConfig;
    onFinalize(cb: () => void): PanConfig;
  };

  export const GestureHandlerRootView: ComponentType<{
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
  }>;
  export const Gesture: {
    Pan(): PanConfig;
    Native(): unknown;
  };

  export const GestureDetector: ComponentType<
    PropsWithChildren<{ gesture: unknown }>
  >;
}

declare module "react-native-svg" {
  import type { ComponentType, PropsWithChildren } from "react";

  const Svg: ComponentType<PropsWithChildren<Record<string, unknown>>>;
  export const Rect: ComponentType<Record<string, unknown>>;
  export const Path: ComponentType<Record<string, unknown>>;
  export default Svg;
}
