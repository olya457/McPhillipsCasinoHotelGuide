import React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';
import {colors} from '../theme';

export type IconName =
  | 'tonight'
  | 'events'
  | 'seat'
  | 'gallery'
  | 'venues'
  | 'back'
  | 'chevron'
  | 'clock'
  | 'pin'
  | 'bell'
  | 'plus'
  | 'close'
  | 'trash'
  | 'edit'
  | 'check'
  | 'vote'
  | 'menu'
  | 'star'
  | 'calendar'
  | 'filter'
  | 'camera'
  | 'ticket'
  | 'info';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Icon = ({
  name,
  size = 22,
  color = colors.text,
  strokeWidth = 1.7,
}: IconProps) => {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'tonight' && (
        <>
          <Path
            {...common}
            d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5 8.6 8.6 0 1 0 20.5 14.2Z"
          />
          <Circle cx={16.5} cy={6.2} r={0.9} fill={color} stroke="none" />
        </>
      )}
      {name === 'events' && (
        <>
          <Rect {...common} x={3} y={5} width={18} height={16} rx={3} />
          <Path {...common} d="M8 3v4M16 3v4M3 10h18" />
          <Circle cx={8.5} cy={14.5} r={1.1} fill={color} stroke="none" />
          <Circle cx={12} cy={14.5} r={1.1} fill={color} stroke="none" />
        </>
      )}
      {name === 'seat' && (
        <>
          <Path {...common} d="M6 4h12v9H6z" />
          <Path {...common} d="M4 13h16v5H4zM6 18v2M18 18v2" />
        </>
      )}
      {name === 'gallery' && (
        <>
          <Rect {...common} x={3} y={4} width={18} height={16} rx={3} />
          <Path {...common} d="m4 16 4.5-4.5 4 3.5L16 12l4 4" />
          <Circle cx={9} cy={9} r={1.4} fill={color} stroke="none" />
        </>
      )}
      {name === 'venues' && (
        <>
          <Path {...common} d="M4 20V8l8-4 8 4v12" />
          <Path {...common} d="M9 20v-6h6v6M2 20h20" />
        </>
      )}
      {name === 'back' && <Path {...common} d="m14.5 5-7 7 7 7" />}
      {name === 'chevron' && <Path {...common} d="m9.5 5 7 7-7 7" />}
      {name === 'clock' && (
        <>
          <Circle {...common} cx={12} cy={12} r={8.5} />
          <Path {...common} d="M12 7.5V12l3.2 2" />
        </>
      )}
      {name === 'pin' && (
        <>
          <Path
            {...common}
            d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0C5.5 15 12 21 12 21Z"
          />
          <Circle {...common} cx={12} cy={10} r={2.4} />
        </>
      )}
      {name === 'bell' && (
        <>
          <Path
            {...common}
            d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10Z"
          />
          <Path {...common} d="M10 18.5a2.2 2.2 0 0 0 4 0" />
        </>
      )}
      {name === 'plus' && <Path {...common} d="M12 5.5v13M5.5 12h13" />}
      {name === 'close' && <Path {...common} d="M6.5 6.5l11 11M17.5 6.5l-11 11" />}
      {name === 'trash' && (
        <>
          <Path {...common} d="M4.5 7h15M9.5 7V4.8h5V7" />
          <Path
            {...common}
            d="M6.5 7l.9 12.2h9.2L17.5 7M10.5 11v5M13.5 11v5"
          />
        </>
      )}
      {name === 'edit' && (
        <>
          <Path {...common} d="M4 20h4l10-10-4-4L4 16v4Z" />
          <Path {...common} d="m14.5 5.5 4 4" />
        </>
      )}
      {name === 'check' && <Path {...common} d="m5 12.5 4.5 4.5L19 7" />}
      {name === 'vote' && (
        <>
          <Path {...common} d="M4 13.5 12 17l8-3.5" />
          <Path {...common} d="M4 17.5 12 21l8-3.5" />
          <Path {...common} d="m8 9 3 3 6-7" />
        </>
      )}
      {name === 'menu' && (
        <>
          <Circle {...common} cx={12} cy={12} r={8.5} />
          <Path {...common} d="M8.5 8.5v7M15.5 8.5v3.2a2.2 2.2 0 0 1-2.2 2.2h-.8" />
        </>
      )}
      {name === 'star' && (
        <Path
          {...common}
          d="m12 4 2.5 5.1 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8Z"
        />
      )}
      {name === 'calendar' && (
        <>
          <Rect {...common} x={3.5} y={5} width={17} height={15.5} rx={3} />
          <Path {...common} d="M8 3v4M16 3v4M3.5 10h17" />
        </>
      )}
      {name === 'filter' && (
        <Path {...common} d="M4 6.5h16M7 12h10M10 17.5h4" />
      )}
      {name === 'camera' && (
        <>
          <Path
            {...common}
            d="M4 8.5h3l1.5-2h7L17 8.5h3v10H4v-10Z"
          />
          <Circle {...common} cx={12} cy={13} r={3.2} />
        </>
      )}
      {name === 'ticket' && (
        <>
          <Path
            {...common}
            d="M3.5 8.5A2 2 0 0 0 5.5 6.5h13a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z"
          />
          <Path {...common} d="M12 8v8" strokeDasharray="2 2.6" />
        </>
      )}
      {name === 'info' && (
        <>
          <Circle {...common} cx={12} cy={12} r={8.5} />
          <Path {...common} d="M12 11v5.5" />
          <Circle cx={12} cy={8} r={1} fill={color} stroke="none" />
        </>
      )}
    </Svg>
  );
};
