import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey, PLANS } from './constants';

const KEY_USAGE   = 'eva_usage_';
const KEY_PLAN    = 'eva_plan';
const KEY_BONUS   = 'eva_bonus_';

// Plan oxu
export const getPlan = async () => {
  try { return (await AsyncStorage.getItem(KEY_PLAN)) || 'free'; }
  catch { return 'free'; }
};

// Plan yaz
export const setPlan = async (plan) => {
  try { await AsyncStorage.setItem(KEY_PLAN, plan); }
  catch {}
};

// Bu günün istifadəsini oxu
export const getUsage = async () => {
  try {
    const v = await AsyncStorage.getItem(KEY_USAGE + getTodayKey());
    return v ? parseInt(v) : 0;
  } catch { return 0; }
};

// İstifadəni artır
export const incUsage = async () => {
  try {
    const k = KEY_USAGE + getTodayKey();
    const v = await AsyncStorage.getItem(k);
    await AsyncStorage.setItem(k, String((v ? parseInt(v) : 0) + 1));
  } catch {}
};

// Bonus istifadə hüquqlarını oxu
export const getBonus = async () => {
  try {
    const v = await AsyncStorage.getItem(KEY_BONUS + getTodayKey());
    return v ? parseInt(v) : 0;
  } catch { return 0; }
};

// Bonus əlavə et (YouTube/TikTok izlədikdən sonra)
export const addBonus = async (amount) => {
  try {
    const k = KEY_BONUS + getTodayKey();
    const v = await AsyncStorage.getItem(k);
    await AsyncStorage.setItem(k, String((v ? parseInt(v) : 0) + amount));
  } catch {}
};

// Limit yoxla — true = istifadə edə bilər
export const canUseAI = async () => {
  const plan  = await getPlan();
  if (plan === 'pro') return true;
  const usage  = await getUsage();
  const bonus  = await getBonus();
  const limit  = PLANS[plan]?.dailyLimit || 10;
  return usage < (limit + bonus);
};

// Qalan hüquq sayı
export const remaining = async () => {
  const plan  = await getPlan();
  if (plan === 'pro') return 999;
  const usage = await getUsage();
  const bonus = await getBonus();
  const limit = PLANS[plan]?.dailyLimit || 10;
  return Math.max(0, limit + bonus - usage);
};
