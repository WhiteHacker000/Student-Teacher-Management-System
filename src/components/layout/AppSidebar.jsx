import { Users, BookOpen, Calendar, BarChart3, Settings, LogOut, GraduationCap, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const teacherNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: BarChart3 },
  { title: 'Students', url: '/students', icon: Users },
  { title: 'Courses', url: '/courses', icon: BookOpen },
  { title: 'Attendance', url: '/attendance', icon: Calendar },
  { title: 'Settings', url: '/settings', icon: Settings },
];

const studentNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: BarChart3 },
  { title: 'My Courses', url: '/my-courses', icon: BookOpen },
  { title: 'My Attendance', url: '/my-attendance', icon: Calendar },
  { title: 'My Grades', url: '/my-grades', icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;
  const getNavClassName = ({ isActive }) =>
    `${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted/60'} transition-all duration-200`;

  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} border-r bg-card transition-all duration-300`}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg gradient-text">EduManage</h2>
              <p className="text-xs text-muted-foreground capitalize">{user?.role} Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClassName}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={logout}
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
