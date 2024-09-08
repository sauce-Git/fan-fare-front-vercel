import { keyframes, style } from "@vanilla-extract/css";

export const candleImgContainer = style({
  display: 'block',
  position: 'relative',
  width: 'auto',
  height: '100%',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'center',
});

export const candleImg = style({
  display: 'block',
  position: 'relative',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  filter: 'drop-shadow(0px 1px 1px #000000B2)',
  zIndex: 2,
});

// glitter animation
const glitteringCandle = keyframes({
  '0%': { opacity: 0.3},
  '30%': { opacity: 1 },
  '60%': { opacity: 0.7 },
  '100%': { opacity: 0.3 },
});

export const glittering = style({
  display: 'block',
  position: 'absolute',
  width: '300%',
  height: 'auto',
  aspectRatio: '1 / 1',
  top: '-10%',
  left: '-100%',
  background: `radial-gradient(40% 50% at 50% 50%, #F0CB35 0%, rgba(255, 255, 255, 0) 100%)`,
  animation: `${glitteringCandle} 3s infinite`,
});