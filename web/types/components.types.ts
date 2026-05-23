// Back Button
export interface BackButtonProps {
  href?: string;
  label?: string;
}

// Chat Layout
export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  time: string;
  active?: boolean;
}

// Markdown
export interface MarkdownProps {
  content: string;
}

// Sidebar
export interface SidebarProps {
  isOpen?:        boolean;
  setIsOpen?:     (val: boolean) => void;
  isCollapsed?:   boolean;
  setIsCollapsed?: (val: boolean) => void;
  sidebarWidth?:  string;
}
