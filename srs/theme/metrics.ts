import {Dimensions, PixelRatio} from 'react-native';

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const window = Dimensions.get('window');

export const screenWidth = window.width;
export const screenHeight = window.height;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const widthRatio = screenWidth / BASE_WIDTH;
const heightRatio = screenHeight / BASE_HEIGHT;

export const horizontalFactor = clamp(widthRatio, 0.8, 1.16);
export const verticalFactor = clamp(heightRatio, 0.82, 1.14);

export const s = (size: number) =>
  PixelRatio.roundToNearestPixel(size * horizontalFactor);

export const vs = (size: number) =>
  PixelRatio.roundToNearestPixel(size * verticalFactor);

export const ms = (size: number, factor = 0.5) =>
  PixelRatio.roundToNearestPixel(size + (s(size) - size) * factor);

export const font = (size: number) =>
  PixelRatio.roundToNearestPixel(size * clamp(widthRatio, 0.85, 1.08));

export const isSmallScreen = screenWidth <= 360 || screenHeight <= 700;
export const isTinyScreen = screenWidth <= 340;
export const isTallScreen = heightRatio >= 1.05;

export const layout = {
  gutter: s(isTinyScreen ? 14 : 18),
  gap: s(12),
  radiusSm: s(10),
  radiusMd: s(16),
  radiusLg: s(22),
  radiusXl: s(28),
  pill: s(999),
  cardHeight: vs(isSmallScreen ? 168 : 196),
  heroHeight: vs(isSmallScreen ? 250 : 300),
  tabBarHeight: vs(isSmallScreen ? 58 : 64),
  buttonHeight: vs(isSmallScreen ? 48 : 54),
  inputHeight: vs(isSmallScreen ? 46 : 52),
  hitSlop: {top: 8, bottom: 8, left: 8, right: 8},
};

export const typography = {
  display: font(isSmallScreen ? 26 : 30),
  h1: font(isSmallScreen ? 22 : 25),
  h2: font(isSmallScreen ? 18 : 20),
  h3: font(isSmallScreen ? 16 : 17),
  body: font(isSmallScreen ? 13.5 : 15),
  bodySm: font(isSmallScreen ? 12.5 : 13.5),
  caption: font(isSmallScreen ? 11 : 12),
  micro: font(isSmallScreen ? 9.5 : 10.5),
  mono: font(isSmallScreen ? 30 : 34),
};
