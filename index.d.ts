import React from 'react';

export interface AutoResponsiveProps {
  containerWidth?: null | number;
  containerHeight?: null | number;
  gridWidth?: number;
  prefixClassName?: string;
  itemClassName?: string;
  itemMargin?: number;
  horizontalDirection?: 'left' | 'right';
  transitionDuration?: number;
  transitionTimingFunction?: string;
  verticalDirection?: 'top' | 'bottom';
  closeAnimation?: boolean;
  onItemDidLayout?: (child: any) => void;
  onContainerDidLayout?: () => void;
}

declare class AutoResponsive extends React.Component<AutoResponsiveProps, any> {}

export default AutoResponsive;