import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { C, uid, fmtAgo } from '../data/constants';
import { Avatar } from '../components/shared';

export default function FeedScreen({ posts: init, contacts }) {
  const [posts, setPosts] = useState(init);
  const [newPost, setNewPost] = useState('');
  const [composing, setComposing] = useState(false);

  const toggleLike = id => setPosts(p => p.map(post =>
    post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
  ));

  const addPost = () => {
    if (!newPost.trim()) return;
    setPosts(p => [{
      id: uid(), contactId: 'me', text: newPost.trim(),
      ts: Date.now(), likes: 0, liked: false, comments: 0, media: null,
    }, ...p]);
    setNewPost(''); setComposing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>FEED</Text>
        <TouchableOpacity onPress={() => setComposing(p => !p)}
          style={[styles.composeBtn, composing && { backgroundColor: C.red + '22', borderColor: C.red + '44' }]}>
          <Text style={{ color: composing ? C.red : C.blue, fontSize: 12, fontWeight: '700' }}>
            {composing ? '✕ Bağla' : '+ Paylaş'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Compose box */}
      {composing && (
        <View style={styles.composeBox}>
          <TextInput style={styles.composeInput} placeholder="Nə düşünürsən?..."
            placeholderTextColor={C.muted} value={newPost} onChangeText={setNewPost}
            multiline numberOfLines={3} />
          <TouchableOpacity onPress={addPost} style={styles.postBtn}>
            <Text style={{ color: '#07071a', fontWeight: '700', fontSize: 13, letterSpacing: 1 }}>
              PAYLAŞ ↑
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList data={posts} keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
        renderItem={({ item: post }) => {
          const contact = post.contactId === 'me'
            ? { name: 'Siz', avatar: 'S', color: C.blue, online: true }
            : contacts.find(c => c.id === post.contactId);
          if (!contact) return null;
          return (
            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <Avatar char={contact.avatar} color={contact.color} size={40} online={contact.online} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ color: C.text, fontWeight: '700', fontSize: 13 }}>{contact.name}</Text>
                  <Text style={{ color: C.muted, fontSize: 10, letterSpacing: 1 }}>{fmtAgo(post.ts)} əvvəl</Text>
                </View>
              </View>

              {post.media === 'photo' && (
                <View style={styles.mediaBox}>
                  <Text style={{ fontSize: 32, color: C.muted }}>🖼️</Text>
                </View>
              )}
              {post.media === 'video' && (
                <View style={[styles.mediaBox, { backgroundColor: C.blue + '12', borderColor: C.blue + '25' }]}>
                  <Text style={{ fontSize: 32, color: C.muted }}>▶️</Text>
                </View>
              )}

              <Text style={{ color: C.text, fontSize: 14, lineHeight: 21, marginBottom: 12 }}>
                {post.text}
              </Text>

              <View style={styles.postActions}>
                <TouchableOpacity onPress={() => toggleLike(post.id)} style={styles.actionBtn}>
                  <Text style={{ fontSize: 16 }}>{post.liked ? '❤️' : '🤍'}</Text>
                  <Text style={{ color: post.liked ? '#ff5566' : C.muted, fontSize: 12, marginLeft: 5 }}>
                    {post.likes}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={{ fontSize: 16 }}>💬</Text>
                  <Text style={{ color: C.muted, fontSize: 12, marginLeft: 5 }}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 'auto' }}>
                  <Text style={{ color: C.muted, fontSize: 12, letterSpacing: 1 }}>↗ Paylaş</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = {
  header: {
    padding: 16, paddingBottom: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: '900', color: C.blue, letterSpacing: 3 },
  composeBtn: {
    paddingVertical: 7, paddingHorizontal: 16, borderRadius: 50,
    borderWidth: 1, borderColor: C.blue + '44', backgroundColor: C.blue + '12',
  },
  composeBox: {
    marginHorizontal: 12, marginBottom: 10,
    backgroundColor: C.card, borderRadius: 18,
    borderWidth: 1, borderColor: C.border, padding: 14,
  },
  composeInput: {
    color: C.text, fontSize: 14, minHeight: 70,
    backgroundColor: C.glass, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, padding: 12, marginBottom: 10,
  },
  postBtn: {
    backgroundColor: C.blue, borderRadius: 50,
    paddingVertical: 11, alignItems: 'center',
  },
  postCard: {
    backgroundColor: C.card, borderRadius: 18,
    borderWidth: 1, borderColor: C.border,
    padding: 16, marginBottom: 10,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  mediaBox: {
    borderRadius: 14, backgroundColor: C.purple + '12',
    borderWidth: 1, borderColor: C.purple + '25',
    height: 130, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
};
