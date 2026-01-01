
import { UserProfile, ActivityLog, CommunicationCard, Task, Course, Review } from '../types.ts';

const DB_PREFIX = 'ajuda_autista_db_v1_';

export interface GameStats {
  memoryBestMoves: number | null;
  simonMaxLevel: number;
  balloonsMaxScore: number;
}

export const DatabaseService = {
  // --- GERENCIAMENTO DE PERFIS ---
  getProfiles: (): UserProfile[] => {
    try {
      const data = localStorage.getItem(`${DB_PREFIX}profiles`);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  saveProfile: (profile: UserProfile) => {
    const profiles = DatabaseService.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) profiles[index] = profile;
    else profiles.push(profile);
    localStorage.setItem(`${DB_PREFIX}profiles`, JSON.stringify(profiles));
  },

  getActiveProfileId: (): string | null => {
    return localStorage.getItem(`${DB_PREFIX}active_profile`);
  },

  setActiveProfile: (id: string) => {
    localStorage.setItem(`${DB_PREFIX}active_profile`, id);
  },

  // --- DADOS DINÂMICOS POR PERFIL ---
  getCollection: <T>(key: string, defaultValue: T): T => {
    const profileId = DatabaseService.getActiveProfileId() || 'default';
    try {
      const data = localStorage.getItem(`${DB_PREFIX}${profileId}_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch { return defaultValue; }
  },

  saveCollection: <T>(key: string, data: T) => {
    const profileId = DatabaseService.getActiveProfileId() || 'default';
    localStorage.setItem(`${DB_PREFIX}${profileId}_${key}`, JSON.stringify(data));
  },

  // --- AVALIAÇÕES DO SITE ---
  getReviews: (): Review[] => {
    try {
      const data = localStorage.getItem(`${DB_PREFIX}site_reviews`);
      const defaultReviews: Review[] = [
        { id: '1', userName: 'Ana Maria', rating: 5, comment: 'Este app mudou a rotina do meu filho. O quadro de voz é perfeito!', timestamp: Date.now() - 86400000, avatar: '👩' },
        { id: '2', userName: 'Carlos Silva', rating: 4, comment: 'Muito intuitivo e bonito. Adorei os jogos!', timestamp: Date.now() - 172800000, avatar: '👨' },
        { id: '3', userName: 'Juliana P.', rating: 5, comment: 'A função de guia visual ajuda muito na autonomia.', timestamp: Date.now() - 259200000, avatar: '🧒' }
      ];
      return data ? JSON.parse(data) : defaultReviews;
    } catch { return []; }
  },

  saveReview: (review: Review) => {
    const reviews = DatabaseService.getReviews();
    const updated = [review, ...reviews];
    localStorage.setItem(`${DB_PREFIX}site_reviews`, JSON.stringify(updated));
  },

  // --- RECORDES DE JOGOS ---
  getGameStats: (): GameStats => {
    return DatabaseService.getCollection<GameStats>('game_stats', {
      memoryBestMoves: null,
      simonMaxLevel: 0,
      balloonsMaxScore: 0
    });
  },

  saveGameStats: (stats: GameStats) => {
    DatabaseService.saveCollection('game_stats', stats);
  },

  // --- LOGS DE ATIVIDADE ---
  logActivity: (type: ActivityLog['type'], detail: string) => {
    const profileId = DatabaseService.getActiveProfileId() || 'default';
    const logs = DatabaseService.getLogs();
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type,
      detail
    };
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(`${DB_PREFIX}${profileId}_logs`, JSON.stringify(updatedLogs));
  },

  getLogs: (): ActivityLog[] => {
    const profileId = DatabaseService.getActiveProfileId() || 'default';
    try {
      const data = localStorage.getItem(`${DB_PREFIX}${profileId}_logs`);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  // --- UTILITÁRIOS ---
  clearAllData: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(DB_PREFIX)) localStorage.removeItem(key);
    });
  }
};
