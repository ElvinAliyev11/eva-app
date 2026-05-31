import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, GRAD, AI_MODULES, YOUTUBE_URL, TIKTOK_URL } from '../data/constants';
import { TypingDots } from '../components/shared';
import { canUseAI, incUsage, remaining, getPlan } from '../data/limitManager';

const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';

// Limit bitti ekranı
function LimitWall({ rem, plan, onRefresh }) {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:28 }}>
      <Text style={{ fontSize:48, marginBottom:14 }}>⚡</Text>
      <Text style={{ color:C.blue, fontSize:16, fontWeight:'900',
        letterSpacing:2, marginBottom:8, textAlign:'center' }}>
        Günlük Limit Bitdi
      </Text>
      <Text style={{ color:C.muted, fontSize:13, textAlign:'center',
        lineHeight:20, marginBottom:24 }}>
        Bu gün üçün AI sorğu limitiniz tükəndi.{'\n'}
        Daha çox sorğu üçün aşağıdakı variantları seçin.
      </Text>

      {/* YouTube bonus */}
      <TouchableOpacity onPress={async () => {
        await Linking.openURL(YOUTUBE_URL);
        setTimeout(onRefresh, 2000);
      }} style={{ borderRadius:50, overflow:'hidden', width:'100%', marginBottom:12 }}>
        <LinearGradient colors={['#ff0000','#cc0000']}
          style={{ paddingVertical:14, alignItems:'center' }}>
          <Text style={{ color:'#fff', fontWeight:'700', fontSize:13, letterSpacing:1 }}>
            ▶  YouTube Kanalı → +10 sorğu
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* TikTok bonus */}
      <TouchableOpacity onPress={async () => {
        await Linking.openURL(TIKTOK_URL);
        setTimeout(onRefresh, 2000);
      }} style={{ borderRadius:50, overflow:'hidden', width:'100%', marginBottom:12 }}>
        <LinearGradient colors={['#69c9d0','#ee1d52']}
          style={{ paddingVertical:14, alignItems:'center' }}>
          <Text style={{ color:'#fff', fontWeight:'700', fontSize:13, letterSpacing:1 }}>
            🎵  TikTok Səhifəsi → +10 sorğu
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* PRO */}
      <TouchableOpacity onPress={onRefresh}
        style={{ borderRadius:50, overflow:'hidden', width:'100%' }}>
        <LinearGradient colors={['#9b4dff','#ff2fd4']}
          style={{ paddingVertical:14, alignItems:'center' }}>
          <Text style={{ color:'#fff', fontWeight:'700', fontSize:13, letterSpacing:1 }}>
            ✦  EVA PRO — Limitsiz İstifadə
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={{ color:C.muted, fontSize:10, marginTop:16,
        letterSpacing:1, textAlign:'center' }}>
        Limit hər gün gecə sıfırlanır
      </Text>
    </View>
  );
}

export default function AIScreen() {
  const [active,   setActive]  = useState(null);
  const [history,  setHistory] = useState({});
  const [input,    setInput]   = useState('');
  const [loading,  setLoading] = useState(false);
  const [rem,      setRem]     = useState(10);
  const [blocked,  setBlocked] = useState(false);
  const scrollRef = useRef();
  const mod = AI_MODULES.find(m => m.id === active);
  const msgs = history[active] || [];

  const loadLimit = async () => {
    const r = await remaining();
    setRem(r);
    setBlocked(r <= 0 && (await getPlan()) !== 'pro');
  };

  useEffect(() => { loadLimit(); }, []);
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 100);
  }, [msgs, loading]);

  const sendMsg = async () => {
    if (!input.trim() || loading) return;
    const ok = await canUseAI();
    if (!ok) { setBlocked(true); return; }

    const userMsg = { role:'user', content:input.trim() };
    const next = [...(history[active]||[]), userMsg];
    setHistory(p => ({ ...p, [active]:next }));
    setInput('');
    setLoading(true);
    await incUsage();
    await loadLimit();

    try {
      const res = await fetch(CLAUDE_URL, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          system:mod.system,
          messages:next,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b=>b.text||'').join('') || 'Xəta baş verdi.';
      setHistory(p => ({ ...p, [active]:[...next,{role:'assistant',content:reply}] }));
    } catch {
      setHistory(p => ({ ...p, [active]:[...next,{role:'assistant',content:'⚠️ Bağlantı xətası.'}] }));
    }
    setLoading(false);
  };

  // Limit bitti
  if (blocked) {
    return <LimitWall rem={rem} onRefresh={async () => { await loadLimit(); setBlocked(false); }} />;
  }

  // Modul grid
  if (!active) {
    return (
      <View style={{ flex:1 }}>
        <View style={{ padding:16, paddingBottom:8 }}>
          <Text style={st.title}>EVA AI</Text>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
            <Text style={{ color:C.green, fontSize:10, letterSpacing:3 }}>
              REAL CLAUDE AI İLƏ İŞLƏYİR
            </Text>
            <View style={{ backgroundColor:rem<=2?C.red+'20':C.blue+'15',
              borderRadius:50, paddingHorizontal:10, paddingVertical:4,
              borderWidth:1, borderColor:rem<=2?C.red+'40':C.blue+'30' }}>
              <Text style={{ color:rem<=2?C.red:C.blue, fontSize:10, fontWeight:'700' }}>
                ⚡ {rem} sorğu
              </Text>
            </View>
          </View>
        </View>
        <FlatList data={AI_MODULES} keyExtractor={i=>i.id} numColumns={2}
          contentContainerStyle={{ padding:12, gap:12 }}
          columnWrapperStyle={{ gap:12 }}
          renderItem={({ item:m }) => (
            <TouchableOpacity onPress={() => setActive(m.id)} activeOpacity={0.8}
              style={[st.moduleCard, history[m.id]?.length ? st.moduleCardActive : {}]}>
              <Text style={{ fontSize:30, marginBottom:10 }}>{m.icon}</Text>
              <Text style={st.moduleName}>{m.label}</Text>
              <Text style={st.moduleDesc}>{m.desc}</Text>
              {history[m.id]?.length > 0 && (
                <Text style={{ color:C.green, fontSize:9, marginTop:6, letterSpacing:1 }}>
                  ● {Math.floor(history[m.id].length/2)} mesaj
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
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{ flex:1 }}>
      {/* Header */}
      <View style={st.chatHeader}>
        <TouchableOpacity onPress={() => setActive(null)}>
          <Text style={{ color:C.blue, fontWeight:'700', fontSize:13, letterSpacing:1 }}>← GERİ</Text>
        </TouchableOpacity>
        <Text style={{ fontSize:22, marginHorizontal:8 }}>{mod.icon}</Text>
        <View style={{ flex:1 }}>
          <Text style={st.modTitle}>{mod.label}</Text>
          <Text style={{ color:C.green, fontSize:9, letterSpacing:2 }}>● CANLI · CLAUDE AI</Text>
        </View>
        <View style={{ backgroundColor:rem<=2?C.red+'20':C.blue+'15',
          borderRadius:50, paddingHorizontal:10, paddingVertical:4 }}>
          <Text style={{ color:rem<=2?C.red:C.blue, fontSize:10, fontWeight:'700' }}>
            ⚡ {rem}
          </Text>
        </View>
        {msgs.length > 0 && (
          <TouchableOpacity onPress={() => setHistory(p=>({...p,[active]:[]}))}
            style={{ marginLeft:8 }}>
            <Text style={{ color:C.muted, fontSize:11 }}>SİL</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={{ flex:1 }}
        contentContainerStyle={{ padding:16, gap:12 }}>
        {msgs.length===0 && (
          <View style={{ alignItems:'center', marginTop:50 }}>
            <Text style={{ fontSize:44, marginBottom:12 }}>{mod.icon}</Text>
            <Text style={st.modTitle}>{mod.label}</Text>
            <Text style={{ color:C.muted, fontSize:13, marginTop:6, textAlign:'center' }}>{mod.desc}</Text>
          </View>
        )}
        {msgs.map((m,i) => (
          <View key={i} style={{ alignItems:m.role==='user'?'flex-end':'flex-start', marginBottom:4 }}>
            <View style={[st.bubble, m.role==='user'?st.bubbleUser:st.bubbleAI]}>
              {m.role==='assistant' && (
                <Text style={{ color:C.blue, fontSize:9, letterSpacing:2, marginBottom:5 }}>
                  ◆ {mod.label}
                </Text>
              )}
              <Text style={{ color:C.text, fontSize:14, lineHeight:21 }}>{m.content}</Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={{ alignItems:'flex-start' }}>
            <View style={st.bubbleAI}><TypingDots /></View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={st.inputRow}>
        <TextInput style={st.msgInput}
          placeholder={`${mod.label}-ə sual ver...`} placeholderTextColor={C.muted}
          value={input} onChangeText={setInput}
          onSubmitEditing={sendMsg} returnKeyType="send"
          editable={!loading} multiline />
        <TouchableOpacity onPress={sendMsg} disabled={loading||!input.trim()}
          style={[st.sendBtn, { opacity:loading||!input.trim()?0.5:1 }]}>
          <Text style={{ color:'#07071a', fontSize:18, fontWeight:'700' }}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = {
  title:      { fontSize:22, fontWeight:'900', color:C.blue, letterSpacing:3, marginBottom:4 },
  moduleCard: { flex:1, backgroundColor:C.card, borderRadius:18,
                borderWidth:1, borderColor:C.border, padding:18, alignItems:'center' },
  moduleCardActive: { backgroundColor:C.blue+'0a', borderColor:C.blue+'35' },
  moduleName: { color:C.blue, fontWeight:'700', fontSize:12, letterSpacing:1, marginBottom:4 },
  moduleDesc: { color:C.muted, fontSize:11, textAlign:'center' },
  chatHeader: { flexDirection:'row', alignItems:'center', gap:8,
                padding:14, paddingHorizontal:16,
                backgroundColor:C.card, borderBottomWidth:1, borderBottomColor:C.border },
  modTitle:   { color:C.blue, fontWeight:'700', fontSize:13, letterSpacing:1 },
  bubble:     { maxWidth:'80%', borderRadius:18, padding:13 },
  bubbleUser: { backgroundColor:'rgba(0,212,255,0.18)', borderWidth:1,
                borderColor:'rgba(0,212,255,0.25)', borderBottomRightRadius:4 },
  bubbleAI:   { backgroundColor:C.glass, borderWidth:1,
                borderColor:C.border, borderBottomLeftRadius:4 },
  inputRow:   { flexDirection:'row', gap:10, padding:12, paddingHorizontal:16,
                backgroundColor:C.card, borderTopWidth:1, borderTopColor:C.border },
  msgInput:   { flex:1, backgroundColor:C.glass, borderWidth:1, borderColor:C.border,
                borderRadius:50, color:C.text, fontSize:14,
                paddingHorizontal:18, paddingVertical:10, maxHeight:100 },
  sendBtn:    { width:44, height:44, borderRadius:22, alignItems:'center',
                justifyContent:'center', backgroundColor:C.blue },
};
