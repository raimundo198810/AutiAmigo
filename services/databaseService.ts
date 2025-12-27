
import { UserProfile, ActivityLog, CommunicationCard, Task } from '../types.ts';

const DB_PREFIX = 'ajuda_autista_db_v1_';

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
    const profileId = DatabaseService.getActiveProfileId();
    if (!profileId) return defaultValue;
    try {
      const data = localStorage.getItem(`${DB_PREFIX}${profileId}_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch { return defaultValue; }
  },

  saveCollection: <T>(key: string, data: T) => {
    const profileId = DatabaseService.getActiveProfileId();
    if (!profileId) return;
    localStorage.setItem(`${DB_PREFIX}${profileId}_${key}`, JSON.stringify(data));
  },

  // --- LOGS DE ATIVIDADE (DATABASE DE EVENTOS) ---
  logActivity: (type: ActivityLog['type'], detail: string) => {
    const profileId = DatabaseService.getActiveProfileId();
    if (!profileId) return;
    const logs = DatabaseService.getLogs();
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type,
      detail
    };
    const updatedLogs = [newLog, ...logs].slice(0, 100); // Mantém últimos 100
    localStorage.setItem(`${DB_PREFIX}${profileId}_logs`, JSON.stringify(updatedLogs));
  },

  getLogs: (): ActivityLog[] => {
    const profileId = DatabaseService.getActiveProfileId();
    if (!profileId) return [];
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
