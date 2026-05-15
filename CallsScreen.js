import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { C, fmtTime } from '../data/constants';
import { Avatar } from '../components/shared';

const TABS = [
  { id: 'all',      label: 'Hamısı' },
  { id: 'incoming', label: 'Gələn' },
  { id: 'outgoing', label: 'Gedən' },
  { id: 'missed',   label: 'Cavabsız' },
];

export default function CallsScreen({ calls, contacts }) {
  const [tab, setTab] = useState('all');
  const filtered = tab === 'all' ? calls : calls.filter(c => c.dir === tab);

  const dirIcon  = d => d === 'incoming' ? '↙' : d === 'outgoing' ? '↗' : '✗';
  const dirColor = d => d === 'missed' ? C.red : d === 'incoming' ? C.green : C.blue;
  const dirLabel = d => d === 'incoming' ? 'GƏLƏN' : d === 'outgoing' ? 'GEDƏN' : 'CAVABSIZ';

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={styles.title}>ZƏNGLƏR</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {TABS.map(t => (
            <TouchableOpacity key={t.id} onPress={() => setTab(t.id)}
              style={[styles.tab, tab === t.id && styles.tabActive]}>
              <Text style={[styles.tabText, tab === t.id && { color: C.blue }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList data={filtered} keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
        renderItem={({ item: call }) => {
          const contact = contacts.find(c => c.id === call.contactId);
          if (!contact) return null;
          return (
            <View style={styles.callItem}>
              <Avatar char={contact.avatar} color={contact.color} size={46} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: C.text, fontWeight: '700', fontSize: 14, marginBottom: 3 }}>
                  {contact.name}
                </Text>
                <Text style={{ color: dirColor(call.dir), fontSize: 11, letterSpacing: 1 }}>
                  {dirIcon(call.dir)} {dirLabel(call.dir)} · {call.type === 'video' ? '📹 VIDEO' : '📞 SƏS'} · {call.dur}
                </Text>
                <Text style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{fmtTime(call.ts)}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={styles.callBtn}>
                  <Text style={{ fontSize: 18 }}>📞</Text>
                </TouchableOpacity>
                {call.type === 'video' && (
                  <TouchableOpacity style={[styles.callBtn, { backgroundColor: C.blue + '15', borderColor: C.blue + '33' }]}>
                    <Text style={{ fontSize: 18 }}>📹</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = {
  title: { fontSize: 22, fontWeight: '900', color: C.blue, letterSpacing: 3, marginBottom: 12 },
  tab: {
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 50,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.glass,
  },
  tabActive: { backgroundColor: C.blue + '18', borderColor: C.blue },
  tabText: { color: C.muted, fontSize: 11, fontWeight: '600' },
  callItem: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderRadius: 16, backgroundColor: C.glass,
    borderWidth: 1, borderColor: C.border, marginBottom: 8,
  },
  callBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.green + '15', borderWidth: 1, borderColor: C.green + '33',
  },
};
