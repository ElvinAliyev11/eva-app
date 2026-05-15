import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { C, fmtTime, uid } from '../data/constants';
import { Avatar } from '../components/shared';

// ── CHAT DETAIL ──────────────────────────────
function ChatDetail({ contact, messages, onSend, onBack }) {
  const [text, setText] = useState('');
  const listRef = useRef();

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    onSend(contact.id, text.trim());
    setText('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={{ color: C.blue, fontSize: 13, fontWeight: '700', letterSpacing: 1 }}>← GERİ</Text>
        </TouchableOpacity>
        <Avatar char={contact.avatar} color={contact.color} size={38} online={contact.online} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.text, fontWeight: '700', fontSize: 13 }}>{contact.name}</Text>
          <Text style={{ color: contact.online ? C.green : C.muted, fontSize: 10, letterSpacing: 1 }}>
            {contact.online ? '● ONLİNE' : `Son görünüş: ${contact.lastSeen}`}
          </Text>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Text style={{ fontSize: 18 }}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.callBtn, { borderColor: C.purple + '33', backgroundColor: C.purple + '15' }]}>
          <Text style={{ fontSize: 18 }}>📹</Text>
        </TouchableOpacity>
      </View>

      {/* E2E Banner */}
      <View style={styles.e2eBanner}>
        <Text style={{ color: C.green + 'aa', fontSize: 10, letterSpacing: 2 }}>
          🔒 END-TO-END ŞİFRƏLİ BAĞLANTI
        </Text>
      </View>

      {/* Messages */}
      <ScrollView ref={listRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}>
        {messages.length === 0 && (
          <Text style={{ textAlign: 'center', color: C.muted, fontSize: 12, marginTop: 40, letterSpacing: 2 }}>
            SÖHBƏTİ BAŞLAT ✦
          </Text>
        )}
        {messages.map(msg => {
          const isMe = msg.from === 'me';
          return (
            <View key={msg.id} style={{ alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={{ color: C.text, fontSize: 14, lineHeight: 20 }}>{msg.text}</Text>
                <Text style={{ color: C.muted, fontSize: 9, marginTop: 3, textAlign: 'right' }}>
                  {fmtTime(msg.ts)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput style={styles.msgInput} placeholder="Mesaj yaz..." placeholderTextColor={C.muted}
          value={text} onChangeText={setText}
          onSubmitEditing={send} returnKeyType="send" multiline />
        <TouchableOpacity onPress={send} style={styles.sendBtn}>
          <Text style={{ color: '#07071a', fontSize: 18, fontWeight: '700' }}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── CHATS LIST ───────────────────────────────
export default function ChatsScreen({ contacts, messages, onSend }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const contact = contacts.find(c => c.id === selected);
  if (selected && contact) {
    return (
      <ChatDetail contact={contact} messages={messages[selected] || []}
        onSend={onSend} onBack={() => setSelected(null)} />
    );
  }

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.listHeader}>
        <Text style={styles.title}>MESAJLAR</Text>
        <TextInput style={styles.searchInput} placeholder="🔍  Axtar..."
          placeholderTextColor={C.muted} value={search} onChangeText={setSearch} />
      </View>
      <FlatList data={filtered} keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
        renderItem={({ item: contact }) => {
          const msgs = messages[contact.id] || [];
          const last = msgs[msgs.length - 1];
          const unread = msgs.filter(m => m.from !== 'me').length;
          return (
            <TouchableOpacity onPress={() => setSelected(contact.id)} activeOpacity={0.75}
              style={[styles.chatItem, unread > 0 ? styles.chatItemUnread : {}]}>
              <Avatar char={contact.avatar} color={contact.color} size={48} online={contact.online} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: C.text, fontWeight: '700', fontSize: 14 }}>{contact.name}</Text>
                  {last && <Text style={{ color: C.muted, fontSize: 10 }}>{fmtTime(last.ts)}</Text>}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                  <Text style={{ color: C.muted, fontSize: 13, flex: 1 }} numberOfLines={1}>
                    {last ? (last.from === 'me' ? 'Siz: ' : '') + last.text : 'Söhbəti başlat...'}
                  </Text>
                  {unread > 0 && (
                    <View style={styles.badge}>
                      <Text style={{ color: '#07071a', fontSize: 10, fontWeight: '700' }}>{unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = {
  listHeader: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '900', color: C.blue, letterSpacing: 3, marginBottom: 12 },
  searchInput: {
    backgroundColor: C.glass, borderWidth: 1, borderColor: C.border,
    borderRadius: 50, color: C.text, fontSize: 14,
    paddingHorizontal: 18, paddingVertical: 10,
  },
  chatItem: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    borderRadius: 16, marginBottom: 6,
    backgroundColor: 'transparent', borderWidth: 1, borderColor: 'transparent',
  },
  chatItemUnread: {
    backgroundColor: C.blue + '08', borderColor: C.blue + '20',
  },
  badge: {
    backgroundColor: C.blue, borderRadius: 50,
    paddingHorizontal: 7, paddingVertical: 2, marginLeft: 6,
  },
  // Chat detail
  chatHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, paddingHorizontal: 16,
    backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  backBtn: { paddingHorizontal: 4 },
  callBtn: {
    width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.blue + '15', borderWidth: 1, borderColor: C.blue + '33',
  },
  e2eBanner: {
    backgroundColor: C.green + '0a', borderBottomWidth: 1, borderBottomColor: C.green + '18',
    paddingVertical: 6, alignItems: 'center',
  },
  bubble: {
    maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: 'rgba(0,212,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(0,212,255,0.25)',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: C.glass, borderWidth: 1, borderColor: C.border,
    borderBottomLeftRadius: 4,
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
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.blue,
  },
};
