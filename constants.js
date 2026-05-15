// ── RƏNGLƏR ──────────────────────────────────
export const C = {
  bg:       '#07071a',
  card:     'rgba(14,14,40,0.97)',
  glass:    'rgba(255,255,255,0.05)',
  border:   'rgba(255,255,255,0.09)',
  blue:     '#00d4ff',
  purple:   '#9b4dff',
  pink:     '#ff2fd4',
  green:    '#00ff9d',
  red:      '#ff5566',
  text:     '#eef2ff',
  muted:    '#6b7399',
};

// ── GRADİENTLƏR ──────────────────────────────
export const GRAD = ['#00d4ff', '#9b4dff'];
export const GRAD_WARM = ['#9b4dff', '#ff2fd4'];

// ── DEMO KONTAKTlar ──────────────────────────
export const uid = () => Math.random().toString(36).slice(2, 9);

export const DEMO_CONTACTS = [
  { id: 'c1', name: 'Aytən Məmmədova', phone: '+994501234567', avatar: 'A', color: '#9b4dff', online: true,  lastSeen: null },
  { id: 'c2', name: 'Elnur Bəşirov',   phone: '+994552345678', avatar: 'E', color: '#00d4ff', online: false, lastSeen: '30 dəq' },
  { id: 'c3', name: 'Kənan Rəhimli',   phone: '+994703456789', avatar: 'K', color: '#00ff9d', online: true,  lastSeen: null },
  { id: 'c4', name: 'Nigar Hüseynova', phone: '+994604567890', avatar: 'N', color: '#ff2fd4', online: false, lastSeen: '2 saat' },
  { id: 'c5', name: 'Tural Quliyev',   phone: '+994515678901', avatar: 'T', color: '#ff8c00', online: true,  lastSeen: null },
];

export const DEMO_MSGS = {
  c1: [
    { id: uid(), from: 'c1', text: 'Salam! Necəsən? 😊',           ts: Date.now() - 3600000 },
    { id: uid(), from: 'me', text: 'Yaxşıyam, sağ ol! Sabah görüşürük?', ts: Date.now() - 3500000 },
    { id: uid(), from: 'c1', text: 'Bəli, saat 15:00-da? 👍',      ts: Date.now() - 3400000 },
  ],
  c2: [
    { id: uid(), from: 'c2', text: 'Fayl göndərdim, bax 📎',       ts: Date.now() - 7200000 },
    { id: uid(), from: 'me', text: 'Gördüm, təşəkkür!',            ts: Date.now() - 7100000 },
  ],
  c3: [],
  c4: [{ id: uid(), from: 'c4', text: 'Okay, anlaşdıq 👍',         ts: Date.now() - 86400000 }],
  c5: [],
};

export const CALL_LOG = [
  { id: uid(), contactId: 'c1', type: 'video', dir: 'incoming', ts: Date.now() - 3600000,   dur: '12:34' },
  { id: uid(), contactId: 'c2', type: 'voice', dir: 'outgoing', ts: Date.now() - 7200000,   dur: '5:21'  },
  { id: uid(), contactId: 'c3', type: 'video', dir: 'missed',   ts: Date.now() - 86400000,  dur: '—'     },
  { id: uid(), contactId: 'c5', type: 'voice', dir: 'outgoing', ts: Date.now() - 172800000, dur: '32:10' },
];

export const FEED_POSTS = [
  { id: uid(), contactId: 'c1', text: 'Bakıda gözəl gün! ☀️ #baku #life',                     ts: Date.now() - 120000,   likes: 124, liked: false, comments: 18, media: 'photo' },
  { id: uid(), contactId: 'c2', text: '🚀 Yeni proyekt! Flutter ilə hazırlayıram — tezliklə 👀', ts: Date.now() - 900000,   likes: 67,  liked: false, comments: 12, media: 'video' },
  { id: uid(), contactId: 'c5', text: 'Səhər məşqi tamamlandı 💪 #fitness #morning',            ts: Date.now() - 3600000,  likes: 45,  liked: false, comments: 9,  media: null   },
];

export const AI_MODULES = [
  { id: 'chat',      icon: '💬', label: 'EVA Chat',      desc: 'Ağıllı söhbət',      system: 'Sən EVA AI - ağıllı Azərbaycan dilli köməkçisən. Qısa, faydalı cavablar ver.' },
  { id: 'vision',    icon: '👁️', label: 'EVA Vision',    desc: 'Şəkil & sənəd',      system: 'Sən şəkil və sənəd analizi edən EVA Vision AI-san. Azərbaycanca cavab ver.' },
  { id: 'music',     icon: '🎵', label: 'EVA Music',     desc: 'Musiqi prompt',       system: 'Sən musiqi promtları yaradan EVA Music AI-san. Azərbaycanca yaradıcı cavab ver.' },
  { id: 'video',     icon: '🎬', label: 'EVA Video',     desc: 'Video ideya',         system: 'Sən video ideyaları yaradan EVA Video AI-san. Azərbaycanca cavab ver.' },
  { id: 'translate', icon: '🌍', label: 'EVA Translate', desc: '50+ dil tərcümə',     system: 'Sən tərcümə edən EVA Translate AI-san. İstənilən dili Azərbaycancaya çevir.' },
  { id: 'assistant', icon: '🤖', label: 'EVA Assistant', desc: 'Smart köməkçi',       system: 'Sən EVA Super Assistant-san. Gündəlik tapşırıqları həll edirsən. Azərbaycanca cavab ver.' },
];

export const fmtTime = (ts) => {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const fmtAgo = (ts) => {
  const diff = Date.now() - ts;
  if (diff < 60000)    return 'indi';
  if (diff < 3600000)  return `${Math.floor(diff / 60000)} dəq`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} saat`;
  return `${Math.floor(diff / 86400000)} gün`;
};
