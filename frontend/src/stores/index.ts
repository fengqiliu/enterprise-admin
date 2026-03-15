import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 主题状态
interface ThemeState {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',
    }
  )
);

// 侧边栏状态
interface SidebarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () =>
        set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed: boolean) => set({ collapsed }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);

// 用户状态
interface User {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  roles: string[];
  permissions: string[];
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);

// 标签页状态
interface Tab {
  key: string;
  title: string;
  path: string;
  icon?: string;
}

interface TabsState {
  tabs: Tab[];
  activeTab: string | null;
  addTab: (tab: Tab) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  closeAll: () => void;
  closeOthers: (key: string) => void;
}

export const useTabsStore = create<TabsState>()((set) => ({
  tabs: [],
  activeTab: null,
  addTab: (tab) =>
    set((state) => {
      const exists = state.tabs.find((t) => t.key === tab.key);
      if (!exists) {
        return { tabs: [...state.tabs, tab], activeTab: tab.key };
      }
      return { activeTab: tab.key };
    }),
  removeTab: (key) =>
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.key !== key);
      const newActiveTab =
        state.activeTab === key
          ? newTabs.length > 0
            ? newTabs[newTabs.length - 1].key
            : null
          : state.activeTab;
      return { tabs: newTabs, activeTab: newActiveTab };
    }),
  setActiveTab: (key) => set({ activeTab: key }),
  closeAll: () => set({ tabs: [], activeTab: null }),
  closeOthers: (key) =>
    set((state) => ({
      tabs: state.tabs.filter((t) => t.key === key),
      activeTab: key,
    })),
}));