
export type Language = 'pt' | 'en' | 'es' | 'fr';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: number;
  avatar: string;
}

export interface CommunicationCard {
  id: string;
  label: string;
  icon: string;
  imageUrl?: string;
  audioUrl?: string;
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

export interface Lesson {
  id: string;
  title: string;
  content: string;
  icon: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  themeColor: string;
  createdAt: number;
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  type: 'card_click' | 'task_complete' | 'breathing_session' | 'other';
  detail: string;
}

export type AppTab = 'board' | 'routine' | 'calm' | 'stepbystep' | 'signs' | 'study' | 'courses' | 'games' | 'incentives' | 'settings' | 'sos' | 'noise' | 'consultant' | 'tracker' | 'gallery' | 'about' | 'contact' | 'autism_info' | 'privacy' | 'sitemap' | 'community' | 'clock';
