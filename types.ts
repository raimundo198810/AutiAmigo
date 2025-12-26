
export interface CommunicationCard {
  id: string;
  label: string;
  icon: string;
  imageUrl?: string;
  color: string;
  category: 'necessidades' | 'sentimentos' | 'atividades';
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  time?: string;
  imageUrl?: string;
}

// Fix: Adicionada interface UserProfile para o ProfileManager
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  themeColor: string;
  createdAt: number;
}

// Fix: Adicionada interface ActivityLog para o DatabaseService
export interface ActivityLog {
  id: string;
  timestamp: number;
  type: 'card_click' | 'task_complete' | 'breathing_session' | 'other';
  detail: string;
}

export type AppTab = 'board' | 'routine' | 'calm' | 'stories' | 'signs' | 'study' | 'games' | 'incentives' | 'settings';
