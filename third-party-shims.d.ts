declare module "react-native-reanimated" {
  import type { ComponentType } from "react";
  import type { ScrollViewProps } from "react-native";

  export enum ReanimatedLogLevel {
    warn,
    error,
  }

  export interface SharedValue<T> {
    value: T;
  }

  export function configureReanimatedLogger(config: {
    level: ReanimatedLogLevel;
    strict: boolean;
  }): void;

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

  export interface PanGestureEvent {
    x: number;
    translationX: number;
    translationY: number;
    velocityY: number;
  }

  export interface PanGestureConfig {
    onBegin(cb: (event: PanGestureEvent) => void): PanGestureConfig;
    onUpdate(cb: (event: PanGestureEvent) => void): PanGestureConfig;
    onEnd(cb: (event: PanGestureEvent) => void): PanGestureConfig;
    onFinalize(cb: () => void): PanGestureConfig;
  }

  export const Gesture: {
    Pan(): PanGestureConfig;
    Native(): unknown;
  };

  export const GestureDetector: ComponentType<
    PropsWithChildren<{ gesture: unknown }>
  >;
}

declare module "react-native-svg" {
  import type { ComponentType, PropsWithChildren } from "react";

  type SvgBaseProps = {
    [key: string]: string | number | boolean | object | undefined;
  };

  const Svg: ComponentType<PropsWithChildren<SvgBaseProps>>;
  export const Rect: ComponentType<SvgBaseProps>;
  export const Path: ComponentType<SvgBaseProps>;
  export default Svg;
}
