declare module "react-native-reanimated" {
  import type { ComponentType } from "react";
  import type { ScrollViewProps } from "react-native";

  export interface SharedValue<T> {
    value: T;
  }

  export function useSharedValue<T>(initialValue: T): SharedValue<T>;
  export function useAnimatedStyle<T extends object>(updater: () => T): T;
  export function withSpring<T>(
    toValue: T,
    config?: object,
    callback?: (finished?: boolean) => void
  ): T;

  const Animated: {
    ScrollView: ComponentType<ScrollViewProps & { className?: string }>;
  };

  export default Animated;
}

declare module "react-native-gesture-handler" {
  import type { ComponentType, PropsWithChildren, ReactNode } from "react";
  import type { ViewStyle } from "react-native";

  export interface GestureHandlerRootViewProps {
    style?: ViewStyle;
    children?: ReactNode;
  }

  export const GestureHandlerRootView: ComponentType<GestureHandlerRootViewProps>;

  export interface PanGestureLikeEvent {
    x: number;
    translationX: number;
    translationY: number;
    velocityY: number;
  }

  export interface PanGestureLikeConfig {
    onBegin(cb: (event: PanGestureLikeEvent) => void): PanGestureLikeConfig;
    onUpdate(cb: (event: PanGestureLikeEvent) => void): PanGestureLikeConfig;
    onEnd(cb: (event: PanGestureLikeEvent) => void): PanGestureLikeConfig;
    onFinalize(cb: () => void): PanGestureLikeConfig;
  }

  export const Gesture: {
    Pan(): PanGestureLikeConfig;
    Native(): unknown;
  };

  export const GestureDetector: ComponentType<
    PropsWithChildren<{ gesture: unknown }>
  >;
}

declare module "react-native-svg" {
  import type { ComponentType, PropsWithChildren } from "react";

  type SvgProps = Record<string, unknown>;

  const Svg: ComponentType<PropsWithChildren<SvgProps>>;
  export const Rect: ComponentType<SvgProps>;
  export const Path: ComponentType<SvgProps>;
  export default Svg;
}
