
export interface CommunicationCard {
  id: string;
  label: string;
  icon: string;
  color: string;
  category: 'necessidades' | 'sentimentos' | 'atividades';
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  time?: string;
}

export type AppTab = 'board' | 'routine' | 'calm' | 'stories';
