import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/** Scale-in "pop" from the homepage design (0.6 → 1.15 → 1). Replays when `key` changes. */
export function usePop(key: unknown, delay = 0) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: 400, delay, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [key, delay, v]);
  return {
    opacity: v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 1, 1] }),
    transform: [{ scale: v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.6, 1.15, 1] }) }],
  };
}

/** Side-to-side wiggle for a wrong answer. Plays each time `trigger` increments. */
export function useWiggle(trigger: number) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!trigger) return;
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: 700, easing: Easing.linear, useNativeDriver: true }).start();
  }, [trigger, v]);
  return {
    transform: [{ rotate: v.interpolate({ inputRange: [0, 0.125, 0.375, 0.625, 0.875, 1], outputRange: ['0deg', '-8deg', '8deg', '-8deg', '8deg', '0deg'] }) }],
  };
}
