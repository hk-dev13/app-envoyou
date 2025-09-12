import React from 'react';

const Sidebar = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`flex h-full w-64 flex-col border-r bg-background ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const SidebarContent = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-1 flex-col gap-4 p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

SidebarContent.displayName = 'SidebarContent';

const SidebarHeader = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`mt-auto px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

SidebarFooter.displayName = 'SidebarFooter';

const SidebarMenu = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <ul
      ref={ref}
      className={`space-y-1 ${className}`}
      {...props}
    >
      {children}
    </ul>
  );
});

SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <li
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </li>
  );
});

SidebarMenuItem.displayName = 'SidebarMenuItem';

const SidebarMenuButton = React.forwardRef(({
  className = '',
  isActive = false,
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

SidebarMenuButton.displayName = 'SidebarMenuButton';

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
};