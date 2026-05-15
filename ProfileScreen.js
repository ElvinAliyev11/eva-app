import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, GRAD, GRAD_WARM } from '../data/constants';
import { Toggle } from '../components/shared';

export default function ProfileScreen({ user, onLogout }) {
  const [pro, setPro] = useState(false);
  const [settings, setSettings] = useState({
    e2e: true, twofa: false, hideOnline: false, notifications: true, darkMode: true,
  });
  const tog = k => setSettings(p => ({ ...p, [k]: !p[k] }));

  const Row = ({ label, desc, k }) => (
    <View style={styles.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        {desc && <Text style={styles.settingDesc}>{desc}</Text>}
      </View>
      <Toggle value={settings[k]} onToggle={() => tog(k)} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.root}>
      {/* Profile card */}
      <LinearGradient colors={['rgba(0,212,255,0.07)', 'rgba(155,77,255,0.09)']}
        style={styles.profileCard}>
        <View style={styles.avatarBig}>
          <Text style={{ color: '#07071a', fontSize: 28, fontWeight: '900' }}>{user.avatar}</Text>
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileContact}>{user.phone || user.email}</Text>
        <View style={styles.activeBadge}>
          <Text style={{ color: C.green, fontSize: 10, letterSpacing: 2 }}>● AKTİV</Text>
        </View>
      </LinearGradient>

      {/* EVA PRO */}
      <TouchableOpacity onPress={() => setPro(p => !p)} activeOpacity={0.85}>
        <LinearGradient
          colors={pro ? ['rgba(155,77,255,0.18)', 'rgba(255,47,212,0.12)'] : ['rgba(14,14,40,0.97)', 'rgba(14,14,40,0.97)']}
          style={styles.proCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.proTitle}>EVA PRO ✦</Text>
            <Text style={styles.proDesc}>
              {pro ? 'Aktiv — Limitsiz AI, Ultra HD zəng' : '₼4.99/ay · 7 gün pulsuz sınaq'}
            </Text>
          </View>
          <Text style={{ color: pro ? C.purple : C.muted, fontSize: 11, letterSpacing: 1 }}>
            {pro ? 'AKTİV' : 'KEÇ →'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TƏHLÜKƏSİZLİK</Text>
        <Row k="e2e"        label="End-to-End Şifrələmə" desc="Bütün mesajlar tam şifrəlidir" />
        <Row k="twofa"      label="2FA Doğrulama"        desc="Əlavə güvenlik qatı" />
        <Row k="hideOnline" label="Online statusu gizlə" />
      </View>

      {/* App */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TƏTBİQ</Text>
        <Row k="notifications" label="Bildirişlər" />
        <Row k="darkMode"      label="Qaranlıq Rejim" desc="Göz üçün rahat" />
      </View>

      {/* Logout */}
      <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
        <Text style={{ color: C.red, fontWeight: '700', fontSize: 13, letterSpacing: 2 }}>ÇIXIŞ ET</Text>
      </TouchableOpacity>

      <Text style={styles.version}>EVA v2.0 · EVERYTHING · VOICE · AI</Text>
    </ScrollView>
  );
}

const styles = {
  root: { backgroundColor: C.bg, paddingHorizontal: 16, paddingBottom: 40 },
  profileCard: {
    borderRadius: 20, padding: 24, alignItems: 'center',
    marginBottom: 14, borderWidth: 1, borderColor: C.border,
  },
  avatarBig: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: C.blue, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  profileName: { color: C.text, fontSize: 18, fontWeight: '900', letterSpacing: 2, marginBottom: 4 },
  profileContact: { color: C.muted, fontSize: 12, letterSpacing: 1, marginBottom: 10 },
  activeBadge: {
    backgroundColor: C.green + '12', borderWidth: 1, borderColor: C.green + '28',
    borderRadius: 50, paddingHorizontal: 14, paddingVertical: 4,
  },
  proCard: {
    borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center',
    marginBottom: 14, borderWidth: 1, borderColor: C.purple + '35',
  },
  proTitle: { fontSize: 16, fontWeight: '900', color: C.purple, letterSpacing: 2, marginBottom: 4 },
  proDesc: { color: C.muted, fontSize: 12 },
  section: {
    backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border,
    padding: 16, marginBottom: 14,
  },
  sectionTitle: { color: C.muted, fontSize: 10, letterSpacing: 3, marginBottom: 8, fontWeight: '700' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  settingLabel: { color: C.text, fontSize: 13, fontWeight: '600' },
  settingDesc: { color: C.muted, fontSize: 11, marginTop: 2 },
  logoutBtn: {
    borderRadius: 50, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: C.red + '25', backgroundColor: C.red + '08', marginBottom: 16,
  },
  version: { textAlign: 'center', color: C.muted, fontSize: 9, letterSpacing: 3 },
};
