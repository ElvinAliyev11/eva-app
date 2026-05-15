import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, GRAD, AI_MODULES } from '../data/constants';
import { TypingDots } from '../components/shared';

const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';

export default function AIScreen() {
  const [active, setActive] = useState(null);
  const [history, setHistory] = useState({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const mod = AI_MODULES.find(m => m.id === active);
  const msgs = history[active] || [];

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [msgs, loading]);

  const sendMsg = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const next = [...(history[active] || []), userMsg];
    setHistory(p => ({ ...p, [active]: next }));
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(CLAUDE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: mod.system,
          messages: next,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || '').join('') || 'Xəta baş verdi.';
      setHistory(p => ({ ...p, [active]: [...next, { role: 'assistant', content: reply }] }));
    } catch {
      setHistory(p => ({ ...p, [active]: [...next, { role: 'assistant', content: '⚠️ Bağlantı xətası.' }] }));
    }
    setLoading(false);
  };

  // Module grid
  if (!active) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ padding: 16, paddingBottom: 8 }}>
          <Text style={styles.title}>EVA AI</Text>
          <Text style={{ color: C.green, fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>
            REAL CLAUDE AI İLƏ İŞLƏYİR
          </Text>
        </View>
        <FlatList
          data={AI_MODULES}
          keyExtractor={i => i.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item: m }) => (
            <TouchableOpacity onPress={() => setActive(m.id)} activeOpacity={0.8}
              style={[styles.moduleCard, history[m.id]?.length ? styles.moduleCardActive : {}]}>
              <Text style={{ fontSize: 30, marginBottom: 10 }}>{m.icon}</Text>
              <Text style={styles.moduleName}>{m.label}</Text>
              <Text style={styles.moduleDesc}>{m.desc}</Text>
              {history[m.id]?.length > 0 && (
                <Text style={{ color: C.green, fontSize: 9, marginTop: 6, letterSpacing: 1 }}>
                  ● {Math.floor(history[m.id].length / 2)} mesaj
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Chat view
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => setActive(null)}>
          <Text style={{ color: C.blue, fontWeight: '700', fontSize: 13, letterSpacing: 1 }}>← GERİ</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, marginHorizontal: 8 }}>{mod.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.modTitle}>{mod.label}</Text>
          <Text style={{ color: C.green, fontSize: 9, letterSpacing: 2 }}>● CANLI · CLAUDE AI</Text>
        </View>
        {msgs.length > 0 && (
          <TouchableOpacity onPress={() => setHistory(p => ({ ...p, [active]: [] }))}>
            <Text style={{ color: C.muted, fontSize: 11 }}>SİL</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {msgs.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 44, marginBottom: 12 }}>{mod.icon}</Text>
            <Text style={styles.modTitle}>{mod.label}</Text>
            <Text style={{ color: C.muted, fontSize: 13, marginTop: 6, textAlign: 'center' }}>{mod.desc}</Text>
          </View>
        )}
        {msgs.map((m, i) => (
          <View key={i} style={{ alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
            <View style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
              {m.role === 'assistant' && (
                <Text style={{ color: C.blue, fontSize: 9, letterSpacing: 2, marginBottom: 5 }}>◆ {mod.label}</Text>
              )}
              <Text style={{ color: C.text, fontSize: 14, lineHeight: 21 }}>{m.content}</Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={{ alignItems: 'flex-start' }}>
            <View style={styles.bubbleAI}>
              <TypingDots />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput style={styles.msgInput}
          placeholder={`${mod.label}-ə sual ver...`} placeholderTextColor={C.muted}
          value={input} onChangeText={setInput}
          onSubmitEditing={sendMsg} returnKeyType="send"
          editable={!loading} multiline />
        <TouchableOpacity onPress={sendMsg} disabled={loading || !input.trim()}
          style={[styles.sendBtn, { opacity: loading || !input.trim() ? 0.5 : 1 }]}>
          <Text style={{ color: '#07071a', fontSize: 18, fontWeight: '700' }}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  title: { fontSize: 22, fontWeight: '900', color: C.blue, letterSpacing: 3, marginBottom: 4 },
  moduleCard: {
    flex: 1, backgroundColor: C.card, borderRadius: 18,
    borderWidth: 1, borderColor: C.border,
    padding: 18, alignItems: 'center',
  },
  moduleCardActive: { backgroundColor: C.blue + '0a', borderColor: C.blue + '35' },
  moduleName: { color: C.blue, fontWeight: '700', fontSize: 12, letterSpacing: 1, marginBottom: 4 },
  moduleDesc: { color: C.muted, fontSize: 11, textAlign: 'center' },
  chatHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 14, paddingHorizontal: 16,
    backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  modTitle: { color: C.blue, fontWeight: '700', fontSize: 13, letterSpacing: 1 },
  bubble: { maxWidth: '80%', borderRadius: 18, padding: 13 },
  bubbleUser: {
    backgroundColor: 'rgba(0,212,255,0.18)', borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.25)', borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: C.glass, borderWidth: 1, borderColor: C.border, borderBottomLeftRadius: 4,
  },
  inputRow: {
    flexDirection: 'row', gap: 10, padding: 12, paddingHorizontal: 16,
    backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border,
  },
  msgInput: {
    flex: 1, backgroundColor: C.glass, borderWidth: 1, borderColor: C.border,
    borderRadius: 50, color: C.text, fontSize: 14,
    paddingHorizontal: 18, paddingVertical: 10, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', backgroundColor: C.blue,
  },
};
