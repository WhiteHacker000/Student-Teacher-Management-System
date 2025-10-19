import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [state, setState] = useState('expanded');
  return (
    <SidebarContext.Provider value={{ state, setState }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}

export function Sidebar({ className = '', children }) {
  return <aside className={`${className}`}>{children}</aside>;
}

export function SidebarHeader({ className = '', children }) {
  return <div className={className}>{children}</div>;
}

export function SidebarContent({ className = '', children }) {
  return <div className={className}>{children}</div>;
}

export function SidebarGroup({ children }) { return <div>{children}</div>; }
export function SidebarGroupLabel({ className = '', children }) { return <div className={className}>{children}</div>; }
export function SidebarGroupContent({ children }) { return <div>{children}</div>; }
export function SidebarMenu({ children }) { return <ul>{children}</ul>; }
export function SidebarMenuItem({ children }) { return <li>{children}</li>; }
export function SidebarMenuButton({ asChild, children, ...props }) {
  const Comp = asChild ? 'span' : 'button';
  return <Comp {...props}>{children}</Comp>;
}

export function SidebarFooter({ className = '', children }) { return <div className={className}>{children}</div>; }

export function SidebarTrigger({ className = '' }) {
  const { state, setState } = useSidebar();
  return (
    <button className={className} onClick={() => setState(state === 'collapsed' ? 'expanded' : 'collapsed')}>
      {state === 'collapsed' ? '➡️' : '⬅️'}
    </button>
  );
}


