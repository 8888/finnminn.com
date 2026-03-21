import React, { useState } from 'react';
import { Typography } from './Typography';

export interface TabProps {
  label: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
  defaultIndex?: number;
}

export const Tabs: React.FC<TabsProps> = ({ children, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  return (
    <div className="flex flex-col">
      <div className="flex border-b-2 border-overlay">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 border-2 rounded-none transition-colors ${
              index === activeIndex
                ? 'border-witchcraft shadow-pixel bg-surface'
                : 'bg-void border-overlay'
            }`}
          >
            <Typography.Body size="sm">{tab.props.label}</Typography.Body>
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs[activeIndex]}</div>
    </div>
  );
};
