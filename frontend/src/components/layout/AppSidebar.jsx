import { Users, BookOpen, Calendar, BarChart3, Settings, GraduationCap, User, NotebookPen, MessageSquare, BellRing, Table2 } from 'lucide-react';
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

const teacherNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: BarChart3 },
  { title: 'Students', url: '/dashboard/students', icon: Users },
  { title: 'Courses', url: '/dashboard/courses', icon: BookOpen },
  { title: 'Assignments', url: '/dashboard/assignments', icon: NotebookPen },
  { title: 'Attendance', url: '/dashboard/attendance', icon: Calendar },
  { title: 'Settings', url: '/dashboard/settings', icon: Settings },
];

const studentNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: BarChart3 },
  { title: 'Timetable', url: '/dashboard/timetable', icon: Table2 },
  { title: 'My Courses', url: '/dashboard/my-courses', icon: BookOpen },
  { title: 'Assignments', url: '/dashboard/assignments', icon: NotebookPen },
  { title: 'Feedback', url: '/dashboard/feedback', icon: User },
  { title: 'Messages', url: '/dashboard/messages', icon: MessageSquare },
  { title: 'Notifications', url: '/dashboard/notifications', icon: BellRing },
  { title: 'My Attendance', url: '/dashboard/my-attendance', icon: Calendar },
  { title: 'My Grades', url: '/dashboard/my-grades', icon: User },
  { title: 'Settings', url: '/dashboard/settings', icon: Settings },
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

  const navItems = user?.Role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} border-r border-purple-500/20 bg-slate-900/60 backdrop-blur-xl transition-all duration-300`}>
      <SidebarHeader className="p-4 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-glow">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">EduManage</h2>
              <p className="text-xs text-slate-400 capitalize">{user?.Role} Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? 'sr-only' : ''} text-purple-300 font-semibold mb-2`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `${isActive 
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-purple-100 border-l-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                          : 'text-slate-300 hover:bg-purple-500/10 hover:text-purple-200'
                        } transition-all duration-300 rounded-lg px-3 py-2.5 group`
                      }
                    >
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      {!collapsed && <span className="font-medium ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
