import React from 'react';

const Sheet = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      {children}
    </div>
  );
};

const SheetContent = React.forwardRef(({
  className = '',
  side = 'right',
  children,
  ...props
}, ref) => {
  const sideClasses = {
    top: 'inset-x-0 top-0 border-b',
    right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    bottom: 'inset-x-0 bottom-0 border-t',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm'
  };

  return (
    <div
      ref={ref}
      className={`fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 ${sideClasses[side]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

SheetContent.displayName = 'SheetContent';

const SheetHeader = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

SheetHeader.displayName = 'SheetHeader';

const SheetTitle = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <h2
      ref={ref}
      className={`text-lg font-semibold text-foreground ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
});

SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

SheetDescription.displayName = 'SheetDescription';

const SheetTrigger = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});

SheetTrigger.displayName = 'SheetTrigger';

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger };