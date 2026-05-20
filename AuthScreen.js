import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, GRAD, uid } from '../data/constants';
import { GradBtn } from '../components/shared';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg';

// EVA Logo SVG
function EvaLogo({ size = 64 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <SvgGrad id="lg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#00d4ff" />
          <Stop offset="0.5" stopColor="#9b4dff" />
          <Stop offset="1" stopColor="#ff2fd4" />
        </SvgGrad>
      </Defs>
      <Path
        d="M58 8 C28 8 10 28 10 54 C10 70 18 83 32 91 L27 110 L48 96 C51 97 55 97 58 97 C88 97 110 78 110 54 C110 28 88 8 58 8Z"
        fill="url(#lg)" opacity={0.18} />
      <Path
        d="M58 8 C28 8 10 28 10 54 C10 70 18 83 32 91 L27 110 L48 96 C51 97 55 97 58 97 C88 97 110 78 110 54 C110 28 88 8 58 8Z"
        stroke="url(#lg)" strokeWidth={3} fill="none" />
      <Circle cx={41} cy={55} r={5.5} fill="#00d4ff" />
      <Circle cx={59} cy={55} r={5.5} fill="#9b4dff" />
      <Circle cx={77} cy={55} r={5.5} fill="#ff2fd4" />
    </Svg>
  );
}

export default function AuthScreen({ onLogin }) {
  const [mode, setMode]     = useState('login');   // login | register | otp
  const [method, setMethod] = useState('phone');   // phone | email
  const [phone, setPhone]   = useState('');
  const [email, setEmail]   = useState('');
  const [name, setName]     = useState('');
  const [otp, setOtp]       = useState(['', '', '', '', '', '']);
  const [shownOtp, setShownOtp] = useState('');
  const [err, setErr]       = useState('');
  const [loading, setLoading] = useState(false);
  const [resendSec, setResendSec] = useState(0);
  const refs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (resendSec <= 0) return;
    timerRef.current = setTimeout(() => setResendSec(s => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [resendSec]);

  const validatePhone = v => /^\+?[0-9\s\-]{7,16}$/.test(v.trim());
  const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const sendOtp = () => {
    setErr('');
    if (method === 'phone' && !validatePhone(phone))
      return setErr('Düzgün telefon nömrəsi daxil edin');
    if (method === 'email' && !validateEmail(email))
      return setErr('Düzgün e-mail ünvanı daxil edin');
    if (mode === 'register' && name.trim().length < 2)
      return setErr('Ad ən azı 2 hərf olmalıdır');

    setLoading(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setShownOtp(code);
      setOtp(['', '', '', '', '', '']);
      setLoading(false);
      setMode('otp');
      setResendSec(60);
      setTimeout(() => refs.current[0]?.focus(), 300);
    }, 900);
  };

  const changeDigit = (i, v) => {
    // Paste bütün kodu doldurur
    if (v.length > 1) {
      const digits = v.replace(/\D/g, '').slice(0, 6).split('');
      const next = ['', '', '', '', '', ''];
      digits.forEach((d, j) => { next[j] = d; });
      setOtp(next);
      refs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v;
    setOtp(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const backspace = (i, e) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const autoFill = () => {
    setOtp(shownOtp.split(''));
    setErr('');
  };

  const verify = () => {
    const entered = otp.join('');
    if (entered.length < 6) return setErr('6 rəqəmli kodu tam daxil edin');
    if (entered !== shownOtp) return setErr('Kod yanlışdır — yenidən yoxlayın');
    const n = name.trim() || (method === 'phone' ? phone : email.split('@')[0]);
    onLogin({
      id: uid(), name: n,
      phone: method === 'phone' ? phone.trim() : null,
      email: method === 'email' ? email.trim() : null,
      avatar: n[0].toUpperCase(), color: C.blue,
    });
  };

  const resend = () => {
    if (resendSec > 0) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setShownOtp(code);
    setOtp(['', '', '', '', '', '']);
    setErr('');
    setResendSec(60);
    setTimeout(() => refs.current[0]?.focus(), 100);
  };

  // ── FORM ──────────────────────────────────
  const FormPanel = () => (
    <View style={styles.card}>
      {/* Giriş / Qeydiyyat */}
      <View style={styles.tabRow}>
        {['login', 'register'].map(m => (
          <TouchableOpacity key={m} onPress={() => { setMode(m); setErr(''); }}
            style={[styles.tabBtn, mode === m && styles.tabBtnActive]}>
            <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
              {m === 'login' ? 'Giriş' : 'Qeydiyyat'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Telefon / Email */}
      <View style={[styles.tabRow, { marginBottom: 16 }]}>
        {[{ id: 'phone', label: '📱 Telefon' }, { id: 'email', label: '📧 E-mail' }].map(mt => (
          <TouchableOpacity key={mt.id} onPress={() => { setMethod(mt.id); setErr(''); }}
            style={[styles.tabBtn, method === mt.id && styles.tabBtnActive]}>
            <Text style={[styles.tabText, method === mt.id && styles.tabTextActive]}>
              {mt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ad (qeydiyyatda) */}
      {mode === 'register' && (
        <View style={{ marginBottom: 14 }}>
          <Text style={styles.label}>AD SOYAD</Text>
          <TextInput style={styles.input} placeholder="Adınız Soyadınız"
            placeholderTextColor={C.muted} value={name}
            onChangeText={setName} autoComplete="name" />
        </View>
      )}

      {/* Telefon / Email */}
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.label}>{method === 'phone' ? 'TELEFON NÖMRƏSİ' : 'E-MAIL ÜNVANı'}</Text>
        {method === 'phone' ? (
          <TextInput style={styles.input} placeholder="+994 50 123 45 67"
            placeholderTextColor={C.muted} value={phone}
            onChangeText={setPhone} keyboardType="phone-pad"
            autoComplete="tel" textContentType="telephoneNumber" />
        ) : (
          <TextInput style={styles.input} placeholder="siz@gmail.com"
            placeholderTextColor={C.muted} value={email}
            onChangeText={setEmail} keyboardType="email-address"
            autoComplete="email" autoCapitalize="none" />
        )}
      </View>

      {err ? <Text style={styles.errText}>⚠ {err}</Text> : null}

      <GradBtn label={loading ? 'GÖNDƏRİLİR...' : 'KOD GÖNDƏR →'} onPress={sendOtp} disabled={loading}
        style={{ marginTop: 4 }} />

      <Text style={styles.secNote}>🔒 256-bit şifrələmə ilə qorunur</Text>
    </View>
  );

  // ── OTP ───────────────────────────────────
  const OtpPanel = () => (
    <View style={styles.card}>
      {/* Başlıq */}
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <Text style={{ fontSize: 34, marginBottom: 6 }}>🔐</Text>
        <Text style={[styles.label, { fontSize: 14, color: C.blue, letterSpacing: 3 }]}>GİRİŞ KODU</Text>
        <Text style={{ color: C.muted, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
          Aşağıdakı kodu giriş xanasına yazın
        </Text>
      </View>

      {/* ── KOD QUTUSU — ən mühüm hissə ── */}
      <LinearGradient
        colors={['rgba(0,212,255,0.12)', 'rgba(155,77,255,0.14)']}
        style={styles.otpBox}>
        <Text style={styles.otpLabel}>↓ SİZİN GİRİŞ KODUNUZ</Text>
        <Text style={styles.otpBig}>{shownOtp}</Text>
        <TouchableOpacity onPress={() => { autoFill(); setTimeout(verify, 200); }}
          style={styles.oneClickBtn}>
          <LinearGradient colors={GRAD} style={styles.oneClickGrad}>
            <Text style={styles.oneClickText}>✦  BU KODLA DAXİL OL</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={{ color: C.muted, fontSize: 10, marginTop: 10, textAlign: 'center', letterSpacing: 1 }}>
          və ya kodu aşağıya özünüz yazın
        </Text>
      </LinearGradient>

      {/* OTP xanaları */}
      <View style={styles.otpRow}>
        {otp.map((d, i) => (
          <TextInput key={i} ref={el => refs.current[i] = el}
            style={[styles.otpCell, d ? styles.otpCellFilled : {}]}
            value={d} maxLength={6}
            onChangeText={v => changeDigit(i, v)}
            onKeyPress={e => backspace(i, e)}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
          />
        ))}
      </View>

      {err ? <Text style={[styles.errText, { textAlign: 'center' }]}>⚠ {err}</Text> : null}

      <GradBtn label="KODU TƏSDİQLƏ →" onPress={verify}
        style={{ marginBottom: 12, opacity: otp.join('').length === 6 ? 1 : 0.45 }} />

      {/* Yenidən göndər / Geri */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => { setMode('login'); setErr(''); setShownOtp(''); setOtp(['','','','','','']); }}>
          <Text style={{ color: C.muted, fontSize: 12, letterSpacing: 1 }}>← Geri</Text>
        </TouchableOpacity>
        {resendSec > 0 ? (
          <Text style={{ color: C.muted, fontSize: 11 }}>Yeni kod — {resendSec}s</Text>
        ) : (
          <TouchableOpacity onPress={resend}>
            <Text style={{ color: C.blue, fontSize: 11, letterSpacing: 1 }}>↺ Yeni kod al</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <EvaLogo size={72} />
          <Text style={styles.logoText}>EVA</Text>
          <Text style={styles.logoSub}>EVERYTHING · VOICE · AI</Text>
        </View>

        {mode !== 'otp' ? <FormPanel /> : <OtpPanel />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  root: {
    flexGrow: 1, backgroundColor: C.bg,
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40,
  },
  card: {
    backgroundColor: C.card, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    padding: 22,
  },
  tabRow: {
    flexDirection: 'row', gap: 8, marginBottom: 18,
  },
  tabBtn: {
    flex: 1, paddingVertical: 9, borderRadius: 50,
    borderWidth: 1, borderColor: C.border,
    backgroundColor: C.glass, alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: C.blue + '22', borderColor: C.blue,
  },
  tabText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: C.blue, fontWeight: '700' },
  label: {
    color: C.muted, fontSize: 10, letterSpacing: 2,
    marginBottom: 7, fontWeight: '600',
  },
  input: {
    backgroundColor: C.glass, borderWidth: 1, borderColor: C.border,
    borderRadius: 13, color: C.text, fontSize: 15,
    paddingHorizontal: 16, paddingVertical: 13,
  },
  errText: {
    color: '#ff8899', fontSize: 12, marginBottom: 12, letterSpacing: 0.5,
  },
  secNote: {
    textAlign: 'center', color: C.muted, fontSize: 11,
    marginTop: 14, letterSpacing: 1,
  },
  logoText: {
    fontSize: 32, fontWeight: '900', color: C.blue,
    letterSpacing: 8, marginTop: 8,
  },
  logoSub: {
    fontSize: 10, color: C.muted, letterSpacing: 5, marginTop: 4,
  },
  // OTP
  otpBox: {
    borderRadius: 16, padding: 18, marginBottom: 20,
    alignItems: 'center', borderWidth: 1, borderColor: C.blue + '44',
  },
  otpLabel: {
    color: C.blue + 'aa', fontSize: 10, letterSpacing: 3,
    marginBottom: 8, fontWeight: '700',
  },
  otpBig: {
    fontSize: 44, fontWeight: '900', color: C.blue,
    letterSpacing: 14, marginBottom: 14,
  },
  oneClickBtn: {
    borderRadius: 50, overflow: 'hidden', width: '100%',
  },
  oneClickGrad: {
    paddingVertical: 13, alignItems: 'center',
  },
  oneClickText: {
    color: '#07071a', fontWeight: '700', fontSize: 13, letterSpacing: 2,
  },
  otpRow: {
    flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 16,
  },
  otpCell: {
    width: 44, height: 52, borderRadius: 11,
    backgroundColor: C.glass, borderWidth: 1, borderColor: C.border,
    color: C.text, fontSize: 22, fontWeight: '700', textAlign: 'center',
  },
  otpCellFilled: {
    backgroundColor: C.blue + '18', borderColor: C.blue,
  },
};
