import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';

import { C, GRAD, DEMO_CONTACTS, DEMO_MSGS, CALL_LOG, FEED_POSTS, uid } from './src/data/constants';
import AuthScreen   from './src/screens/AuthScreen';
import ChatsScreen  from './src/screens/ChatsScreen';
import CallsScreen  from './src/screens/CallsScreen';
import AIScreen     from './src/screens/AIScreen';
import FeedScreen   from './src/screens/FeedScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// ── EVA LOGO ──────────────────────────────────
function EvaLogo({ size = 30 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <SvgGrad id="hg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#00d4ff" />
          <Stop offset="0.5" stopColor="#9b4dff" />
          <Stop offset="1" stopColor="#ff2fd4" />
        </SvgGrad>
      </Defs>
      <Path d="M58 8 C28 8 10 28 10 54 C10 70 18 83 32 91 L27 110 L48 96 C51 97 55 97 58 97 C88 97 110 78 110 54 C110 28 88 8 58 8Z"
        fill="url(#hg)" opacity={0.2} />
      <Path d="M58 8 C28 8 10 28 10 54 C10 70 18 83 32 91 L27 110 L48 96 C51 97 55 97 58 97 C88 97 110 78 110 54 C110 28 88 8 58 8Z"
        stroke="url(#hg)" strokeWidth={3} fill="none" />
      <Circle cx={41} cy={55} r={5.5} fill="#00d4ff" />
      <Circle cx={59} cy={55} r={5.5} fill="#9b4dff" />
      <Circle cx={77} cy={55} r={5.5} fill="#ff2fd4" />
    </Svg>
  );
}

// ── NAV ITEMS ─────────────────────────────────
const NAV = [
  { id: 'chats',   icon: '💬', label: 'Çat' },
  { id: 'calls',   icon: '📞', label: 'Zəng' },
  { id: 'ai',      icon: null, label: 'AI' },
  { id: 'feed',    icon: '🔥', label: 'Feed' },
  { id: 'profile', icon: '👤', label: 'Profil' },
];

// ── BOTTOM NAV ────────────────────────────────
function BottomNav({ active, onSelect }) {
  return (
    <View style={{
      flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
      paddingTop: 8, paddingBottom: 20, paddingHorizontal: 8,
      backgroundColor: 'rgba(10,10,28,0.98)',
      borderTopWidth: 1, borderTopColor: C.border,
    }}>
      {NAV.map(item => {
        if (item.id === 'ai') {
          return (
            <TouchableOpacity key="ai" onPress={() => onSelect('ai')}
              activeOpacity={0.8}
              style={{ marginTop: -14 }}>
              <LinearGradient
                colors={active === 'ai' ? GRAD : ['rgba(0,212,255,0.3)', 'rgba(155,77,255,0.3)']}
                style={{
                  width: 52, height: 52, borderRadius: 26,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: active === 'ai' ? 0 : 1.5,
                  borderColor: 'rgba(0,212,255,0.4)',
                }}>
                <Text style={{
                  color: active === 'ai' ? '#07071a' : C.blue,
                  fontSize: 20, fontWeight: '900',
                }}>✦</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        }
        const on = active === item.id;
        return (
          <TouchableOpacity key={item.id} onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
            style={{ alignItems: 'center', gap: 3, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontSize: 22, opacity: on ? 1 : 0.6 }}>{item.icon}</Text>
            <Text style={{
              fontSize: 9, letterSpacing: 1,
              color: on ? C.blue : C.muted,
              fontWeight: on ? '700' : '400',
            }}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── MAIN APP ──────────────────────────────────
export default function App() {
  const [user, setUser]       = useState(null);
  const [screen, setScreen]   = useState('chats');
  const [contacts]            = useState(DEMO_CONTACTS);
  const [messages, setMsgs]   = useState(DEMO_MSGS);
  const [calls]               = useState(CALL_LOG);
  const [posts]               = useState(FEED_POSTS);

  const handleSend = useCallback((contactId, text) => {
    const msg = { id: uid(), from: 'me', text, ts: Date.now() };
    setMsgs(prev => ({ ...prev, [contactId]: [...(prev[contactId] || []), msg] }));
  }, []);

  // Auth
  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <AuthScreen onLogin={setUser} />
      </SafeAreaView>
    );
  }

  // Main app
  const renderScreen = () => {
    switch (screen) {
      case 'chats':   return <ChatsScreen contacts={contacts} messages={messages} onSend={handleSend} />;
      case 'calls':   return <CallsScreen calls={calls} contacts={contacts} />;
      case 'ai':      return <AIScreen />;
      case 'feed':    return <FeedScreen posts={posts} contacts={contacts} />;
      case 'profile': return <ProfileScreen user={user} onLogout={() => setUser(null)} />;
      default:        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Top header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: 'rgba(14,14,40,0.97)',
        borderBottomWidth: 1, borderBottomColor: C.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <EvaLogo size={32} />
          <Text style={{ color: C.blue, fontWeight: '900', fontSize: 18, letterSpacing: 5 }}>EVA</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            backgroundColor: C.green + '12', borderWidth: 1, borderColor: C.green + '25',
            borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4,
          }}>
            <Text style={{ color: C.green, fontSize: 9, letterSpacing: 2 }}>● CANLI</Text>
          </View>
          <View style={{
            width: 32, height: 32, borderRadius: 16,
            backgroundColor: C.blue + '22', borderWidth: 1.5, borderColor: C.blue + '55',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: C.blue, fontWeight: '700', fontSize: 13 }}>{user.avatar}</Text>
          </View>
        </View>
      </View>

      {/* Screen */}
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {renderScreen()}
      </View>

      {/* Bottom Nav */}
      <BottomNav active={screen} onSelect={setScreen} />
    </SafeAreaView>
  );
}
