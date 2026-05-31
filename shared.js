import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, GRAD } from '../data/constants';

// ── AVATAR ────────────────────────────────────
export function Avatar({ char, color, size = 44, online }) {
  return (
    <View style={{ position: 'relative' }}>
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color + '22',
        borderWidth: 2, borderColor: color + '55',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ color, fontWeight: '700', fontSize: size * 0.38 }}>{char}</Text>
      </View>
      {online !== undefined && (
        <View style={{
          position: 'absolute', bottom: 1, right: 1,
          width: 10, height: 10, borderRadius: 5,
          backgroundColor: online ? C.green : C.muted,
          borderWidth: 2, borderColor: C.bg,
        }} />
      )}
    </View>
  );
}

// ── GRAD BUTTON ───────────────────────────────
export function GradBtn({ label, onPress, style, disabled }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}
      style={{ borderRadius: 50, overflow: 'hidden', opacity: disabled ? 0.5 : 1, ...style }}>
      <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ paddingVertical: 14, paddingHorizontal: 28, alignItems: 'center' }}>
        <Text style={{ color: '#07071a', fontWeight: '700', fontSize: 13, letterSpacing: 2 }}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ── GHOST BUTTON ──────────────────────────────
export function GhostBtn({ label, onPress, color, style }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}
      style={{
        borderRadius: 50, borderWidth: 1,
        borderColor: (color || C.border),
        paddingVertical: 12, paddingHorizontal: 24,
        alignItems: 'center', ...style,
      }}>
      <Text style={{ color: color || C.text, fontWeight: '700', fontSize: 12, letterSpacing: 2 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── SECTION HEADER ────────────────────────────
export function ScreenTitle({ title }) {
  return (
    <Text style={{
      fontSize: 22, fontWeight: '900', color: C.blue,
      letterSpacing: 3, marginBottom: 14,
    }}>{title}</Text>
  );
}

// ── CARD ─────────────────────────────────────
export function Card({ children, style }) {
  return (
    <View style={{
      backgroundColor: C.card, borderRadius: 18,
      borderWidth: 1, borderColor: C.border,
      padding: 16, ...style,
    }}>
      {children}
    </View>
  );
}

// ── TOGGLE ────────────────────────────────────
export function Toggle({ value, onToggle }) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}
      style={{
        width: 46, height: 26, borderRadius: 13,
        backgroundColor: value ? C.blue : C.glass,
        borderWidth: 1, borderColor: value ? C.blue : C.border,
        justifyContent: 'center', padding: 2,
      }}>
      <View style={{
        width: 20, height: 20, borderRadius: 10,
        backgroundColor: '#fff',
        marginLeft: value ? 22 : 2,
      }} />
    </TouchableOpacity>
  );
}

// ── TYPING DOTS ───────────────────────────────
export function TypingDots() {
  const [frame, setFrame] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setFrame(f => (f + 1) % 3), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 14, paddingVertical: 10 }}>
      {[0, 1, 2].map(i => (
        <View key={i} style={{
          width: 7, height: 7, borderRadius: 4,
          backgroundColor: C.blue,
          opacity: frame === i ? 1 : 0.3,
        }} />
      ))}
    </View>
  );
}
