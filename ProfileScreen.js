import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, GRAD, GRAD_WARM, PLANS } from '../data/constants';
import { Toggle } from '../components/shared';
import { getPlan, getUsage, getBonus, remaining } from '../data/limitManager';
import PremiumScreen from './PremiumScreen';

export default function ProfileScreen({ user, onLogout }) {
  const [showPremium, setShowPremium] = useState(false);
  const [plan,  setPlanState]  = useState('free');
  const [rem,   setRem]        = useState(10);
  const [bonus, setBonusState] = useState(0);
  const [settings, setSettings] = useState({
    e2e:true, twofa:false, hideOnline:false, notifications:true,
  });

  const load = async () => {
    const p = await getPlan();
    const r = await remaining();
    const b = await getBonus();
    setPlanState(p); setRem(r); setBonusState(b);
  };

  useEffect(() => { load(); }, []);

  const tog = k => setSettings(p => ({ ...p, [k]:!p[k] }));

  if (showPremium) {
    return <PremiumScreen onClose={() => { setShowPremium(false); load(); }} />;
  }

  const Row = ({ label, desc, k }) => (
    <View style={st.settingRow}>
      <View style={{ flex:1 }}>
        <Text style={st.settingLabel}>{label}</Text>
        {desc && <Text style={st.settingDesc}>{desc}</Text>}
      </View>
      <Toggle value={settings[k]} onToggle={() => tog(k)} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={st.root}>
      {/* Profile card */}
      <LinearGradient colors={['rgba(0,212,255,0.07)','rgba(155,77,255,0.09)']}
        style={st.profileCard}>
        <View style={st.avatarBig}>
          <Text style={{ color:'#07071a', fontSize:28, fontWeight:'900' }}>{user.avatar}</Text>
        </View>
        <Text style={st.profileName}>{user.name}</Text>
        <Text style={st.profileContact}>{user.phone || user.email}</Text>
        <View style={st.activeBadge}>
          <Text style={{ color:C.green, fontSize:10, letterSpacing:2 }}>● AKTİV</Text>
        </View>
      </LinearGradient>

      {/* Plan & limit kartı */}
      <TouchableOpacity onPress={() => setShowPremium(true)} activeOpacity={0.85}>
        <LinearGradient
          colors={plan==='pro'
            ? ['rgba(155,77,255,0.18)','rgba(255,47,212,0.12)']
            : ['rgba(14,14,40,0.97)','rgba(14,14,40,0.97)']}
          style={st.proCard}>
          <View style={{ flex:1 }}>
            <Text style={st.proTitle}>
              {plan==='pro' ? 'EVA PRO ✦' : 'EVA PREMIUM'}
            </Text>
            <Text style={st.proDesc}>
              {plan==='pro'
                ? 'Aktiv — Limitsiz AI istifadəsi'
                : `⚡ ${rem} sorğu qalıb${bonus>0?`  +${bonus} bonus`:''}`}
            </Text>
          </View>
          <Text style={{ color:plan==='pro'?C.purple:C.blue, fontSize:11, letterSpacing:1 }}>
            {plan==='pro' ? 'AKTİV ✦' : 'PLANLAR →'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Security */}
      <View style={st.section}>
        <Text style={st.sectionTitle}>TƏHLÜKƏSİZLİK</Text>
        <Row k="e2e"        label="End-to-End Şifrələmə" desc="Bütün mesajlar tam şifrəlidir" />
        <Row k="twofa"      label="2FA Doğrulama"        desc="Əlavə güvenlik qatı" />
        <Row k="hideOnline" label="Online statusu gizlə" />
      </View>

      {/* App */}
      <View style={st.section}>
        <Text style={st.sectionTitle}>TƏTBİQ</Text>
        <Row k="notifications" label="Bildirişlər" />
      </View>

      <TouchableOpacity onPress={onLogout} style={st.logoutBtn}>
        <Text style={{ color:C.red, fontWeight:'700', fontSize:13, letterSpacing:2 }}>ÇIXIŞ ET</Text>
      </TouchableOpacity>

      <Text style={st.version}>EVA v2.0 · EVERYTHING · VOICE · AI</Text>
    </ScrollView>
  );
}

const st = {
  root: { backgroundColor:C.bg, paddingHorizontal:16, paddingBottom:40 },
  profileCard: { borderRadius:20, padding:24, alignItems:'center',
    marginBottom:14, borderWidth:1, borderColor:C.border },
  avatarBig: { width:72, height:72, borderRadius:36, backgroundColor:C.blue,
    alignItems:'center', justifyContent:'center', marginBottom:12 },
  profileName:    { color:C.text, fontSize:18, fontWeight:'900', letterSpacing:2, marginBottom:4 },
  profileContact: { color:C.muted, fontSize:12, letterSpacing:1, marginBottom:10 },
  activeBadge: { backgroundColor:C.green+'12', borderWidth:1, borderColor:C.green+'28',
    borderRadius:50, paddingHorizontal:14, paddingVertical:4 },
  proCard: { borderRadius:18, padding:18, flexDirection:'row', alignItems:'center',
    marginBottom:14, borderWidth:1, borderColor:C.purple+'35' },
  proTitle: { fontSize:16, fontWeight:'900', color:C.purple, letterSpacing:2, marginBottom:4 },
  proDesc:  { color:C.muted, fontSize:12 },
  section:  { backgroundColor:C.card, borderRadius:18, borderWidth:1, borderColor:C.border,
    padding:16, marginBottom:14 },
  sectionTitle: { color:C.muted, fontSize:10, letterSpacing:3, marginBottom:8, fontWeight:'700' },
  settingRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingVertical:12, borderBottomWidth:1, borderBottomColor:C.border },
  settingLabel: { color:C.text, fontSize:13, fontWeight:'600' },
  settingDesc:  { color:C.muted, fontSize:11, marginTop:2 },
  logoutBtn: { borderRadius:50, paddingVertical:14, alignItems:'center',
    borderWidth:1, borderColor:C.red+'25', backgroundColor:C.red+'08', marginBottom:16 },
  version: { textAlign:'center', color:C.muted, fontSize:9, letterSpacing:3 },
};
