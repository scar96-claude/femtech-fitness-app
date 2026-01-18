import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
} from 'react-native';
import { COLORS } from '@/constants/colors';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  label: string;
  valueLabel?: (value: number) => string;
}

export function Slider({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
  label,
  valueLabel,
}: SliderProps) {
  const [sliderWidth, setSliderWidth] = React.useState(0);

  const calculateValue = (locationX: number): number => {
    const ratio = Math.max(0, Math.min(1, locationX / sliderWidth));
    const rawValue = minimumValue + ratio * (maximumValue - minimumValue);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(minimumValue, Math.min(maximumValue, steppedValue));
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const newValue = calculateValue(evt.nativeEvent.locationX);
          onValueChange(newValue);
        },
        onPanResponderMove: (evt) => {
          const newValue = calculateValue(evt.nativeEvent.locationX);
          onValueChange(newValue);
        },
      }),
    [sliderWidth, minimumValue, maximumValue, step, onValueChange]
  );

  const progress =
    ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.valueText}>
            {valueLabel ? valueLabel(value) : value}
          </Text>
        </View>
      )}

      <View
        style={styles.sliderContainer}
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>
        <View
          style={[
            styles.thumb,
            { left: `${progress}%`, marginLeft: -12 },
          ]}
        />
      </View>

      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>{minimumValue}</Text>
        <Text style={styles.rangeText}>{maximumValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: COLORS.neutral[700],
    fontWeight: '500',
    fontSize: 14,
  },
  valueText: {
    color: COLORS.primary[600],
    fontWeight: '600',
    fontSize: 14,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary[500],
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary[500],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeText: {
    color: COLORS.neutral[400],
    fontSize: 12,
  },
});
