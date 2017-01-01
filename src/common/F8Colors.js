/**
 * @providesModule F8Colors
 * @flow
 */

'use strict';

const LOCATION_COLORS = {
  'HERBST': '#00E3AD',
  'HERBST A': '#00E3AD',
  'HERBST B': '#00E3AD',
  'HACKER X': '#4D99EF',
  'HACKER Y': '#CF72B1',
  'COWELL': '#6A6AD5',
  'COWELL C': '#6A6AD5',
  'FOOD TENT': '#FFCD3B',
};

export function colorForLocation(location: ?string): string {
  if (location) {
    const color = LOCATION_COLORS[location.toUpperCase()];
    if (color) {
      return color;
    } else {
      console.warn(`Location '${location}' has no color`);
    }
  }

  return '#000';
}

export function colorForTopic(count: number, index: number): string {
  const hue = Math.round(360 * index / (count + 1));
  return `hsl(${hue}, 74%, 65%)`;
}

export default {
  actionText: '#3FB4CF',
  inactiveText: '#9B9B9B',
  darkText: '#032250',
  lightText: '#7F91A7',
  cellBorder: '#EEEEEE',
  darkBackground: '#183E63',
};
