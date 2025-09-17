import React, { useState } from 'react';

const Tabs = ({ children, defaultValue, onValueChange }) => {
  const [activeValue, setActiveValue] = useState(defaultValue);

  const handleValueChange = (newValue) => {
    setActiveValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value: activeValue, onValueChange: handleValueChange })
      )}
    </div>
  );
};

const TabsList = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({
  className = '',
  value: triggerValue,
  children,
  onClick,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm ${className}`}
      data-state={props['data-state'] || 'inactive'}
  onClick={() => onClick?.(triggerValue)}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(({
  className = '',
  value: _contentValue,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      data-state={props['data-state'] || 'inactive'}
      {...props}
    >
      {children}
    </div>
  );
});

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };