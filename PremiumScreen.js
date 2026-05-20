import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Linking, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, GRAD, GRAD_WARM, YOUTUBE_URL, TIKTOK_URL, PLANS } from '../data/constants';
import { getPlan, setPlan, getUsage, getBonus, addBonus, remaining } from '../data/limitManager';

export default function PremiumScreen({ onClose }) {
  const [plan,      setPlanState]  = useState('free');
  const [used,      setUsed]       = useState(0);
  const [bonus,     setBonusState] = useState(0);
  const [rem,       setRem]        = useState(0);
  const [ytWatched, setYtWatched]  = useState(false);
  const [ttWatched, setTtWatched]  = useState(false);

  const load = async () => {
    const p = await getPlan();
    const u = await getUsage();
    const b = await getBonus();
    const r = await remaining();
    setPlanState(p); setUsed(u); setBonusState(b); setRem(r);
  };

  useEffect(() => { load(); }, []);

  // YouTube izlə → +10 bonus
  const watchYouTube = async () => {
    await Linking.openURL(YOUTUBE_URL);
    setYtWatched(true);
    Alert.alert(
      '🎉 Təşəkkür!',
      'Kanalımıza baxdığınız üçün +10 əlavə AI hüququ qazandınız!',
      [{
        text: 'Bonusu al ✦',
        onPress: async () => {
          await addBonus(10);
          await load();
        },
      }],
    );
  };

  // TikTok izlə → +10 bonus
  const watchTikTok = async () => {
    await Linking.openURL(TIKTOK_URL);
    setTtWatched(true);
    Alert.alert(
      '🎉 Təşəkkür!',
      'TikTok səhifəmizə baxdığınız üçün +10 əlavə AI hüququ qazandınız!',
      [{
        text: 'Bonusu al ✦',
        onPress: async () => {
          await addBonus(10);
          await load();
        },
      }],
    );
  };

  // Pro aktivləşdir
  const activatePro = async () => {
    await setPlan('pro');
    await load();
    Alert.alert('✦ EVA PRO', 'Uğurla aktivləşdi! Limitsiz AI istifadəsindən zövq alın.');
  };

  const TIERS = [
    {
      id: 'free',
      icon: '⚡',
      label: 'FREE',
      color: C.muted,
      daily: 10,
      perks: ['Gündəlük 10 AI sorğusu', 'Bütün əsas funksiyalar', 'Mesajlaşma & Zəng'],
    },
    {
      id: 'youtube',
      icon: '▶️',
      label: 'YOUTUBE BONUS',
      color: '#ff0000',
      daily: 20,
      extra: '+10 bonus hər gün',
      perks: ['Gündəlük 20 AI sorğusu', '+10 YouTube izlədikdən sonra', 'Prioritet cavab'],
      action: watchYouTube,
      actionLabel: '▶ YouTube Kanalını İzlə',
      actionColor: ['#ff0000', '#cc0000'],
    },
    {
      id: 'tiktok',
      icon: '🎵',
      label: 'TIKTOK BONUS',
      color: '#69c9d0',
      daily: 30,
      extra: '+10 bonus hər gün',
      perks: ['Gündəlük 30 AI sorğusu', '+10 TikTok izlədikdən sonra', 'Xüsusi stikerlər'],
      action: watchTikTok,
      actionLabel: '🎵 TikTok Səhifəsini İzlə',
      actionColor: ['#69c9d0', '#ee1d52'],
    },
    {
      id: 'pro',
      icon: '✦',
      label: 'EVA PRO',
      color: C.purple,
      daily: '∞',
      extra: 'LİMİTSİZ',
      perks: [
        'Limitsiz AI sorğusu',
        'Ultra HD Videozəng',
        'AI Avatar & Video Yaratma',
        'AI Musiqi Generator',
        'Premium Stikerlər',
        'Reklamsız istifadə',
        'Prioritet dəstək',
      ],
      action: activatePro,
      actionLabel: '✦ EVA PRO-nu Aktivləşdir',
      actionColor: GRAD_WARM,
      price: '₼4.99/ay',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <LinearGradient colors={['rgba(155,77,255,0.15)','rgba(0,212,255,0.08)']}
        style={{ padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <TouchableOpacity onPress={onClose} style={{ marginBottom: 12 }}>
          <Text style={{ color: C.blue, fontSize: 13, fontWeight: '700', letterSpacing: 1 }}>← GERİ</Text>
        </TouchableOpacity>
        <Text style={{ color: C.purple, fontSize: 11, letterSpacing: 4, marginBottom: 4 }}>EVA PREMIUM</Text>
        <Text style={{ color: C.text, fontSize: 24, fontWeight: '900', letterSpacing: 2, marginBottom: 12 }}>
          Planını Seç ✦
        </Text>

        {/* Usage bar */}
        <View style={{ backgroundColor: C.glass, borderRadius: 12, padding: 14,
          borderWidth: 1, borderColor: C.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: C.muted, fontSize: 11, letterSpacing: 1 }}>
              Bu günün istifadəsi
            </Text>
            <Text style={{ color: C.blue, fontSize: 11, fontWeight: '700' }}>
              {plan === 'pro' ? '∞' : `${rem} qalıb`}
            </Text>
          </View>
          {plan !== 'pro' && (
            <View style={{ height: 6, backgroundColor: C.glass, borderRadius: 3, overflow: 'hidden' }}>
              <LinearGradient colors={GRAD}
                style={{
                  height: '100%', borderRadius: 3,
                  width: `${Math.min(100, (used / (PLANS[plan]?.dailyLimit || 10)) * 100)}%`,
                }} />
            </View>
          )}
          <Text style={{ color: C.muted, fontSize: 10, marginTop: 6, letterSpacing: 1 }}>
            Cari plan: <Text style={{ color: C.blue }}>{PLANS[plan]?.label}</Text>
            {bonus > 0 && <Text style={{ color: C.green }}>  +{bonus} bonus</Text>}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {TIERS.map(tier => {
          const isActive = plan === tier.id;
          return (
            <View key={tier.id} style={{
              borderRadius: 20, overflow: 'hidden',
              borderWidth: isActive ? 2 : 1,
              borderColor: isActive ? tier.color : C.border,
            }}>
              <LinearGradient
                colors={isActive
                  ? [`${tier.color}18`, `${tier.color}08`]
                  : [C.card, C.card]}
                style={{ padding: 18 }}>

                {/* Tier başlığı */}
                <View style={{ flexDirection: 'row', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontSize: 26 }}>{tier.icon}</Text>
                    <View>
                      <Text style={{ color: tier.color, fontWeight: '900',
                        fontSize: 14, letterSpacing: 2 }}>{tier.label}</Text>
                      {tier.price && (
                        <Text style={{ color: C.muted, fontSize: 11 }}>{tier.price}</Text>
                      )}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: tier.color, fontSize: 22, fontWeight: '900' }}>
                      {tier.daily}
                    </Text>
                    <Text style={{ color: C.muted, fontSize: 9, letterSpacing: 1 }}>
                      {tier.extra || 'sorğu/gün'}
                    </Text>
                  </View>
                </View>

                {/* Üstünlüklər */}
                {tier.perks.map((p, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center',
                    gap: 8, marginBottom: 5 }}>
                    <Text style={{ color: tier.color, fontSize: 12 }}>✓</Text>
                    <Text style={{ color: C.text, fontSize: 12 }}>{p}</Text>
                  </View>
                ))}

                {/* Aktiv badge */}
                {isActive && (
                  <View style={{ backgroundColor: `${tier.color}20`,
                    borderRadius: 50, paddingVertical: 6, alignItems: 'center',
                    marginTop: 12, borderWidth: 1, borderColor: `${tier.color}40` }}>
                    <Text style={{ color: tier.color, fontSize: 11,
                      fontWeight: '700', letterSpacing: 2 }}>● AKTİV PLAN</Text>
                  </View>
                )}

                {/* Action düyməsi */}
                {tier.action && !isActive && (
                  <TouchableOpacity onPress={tier.action}
                    style={{ borderRadius: 50, overflow: 'hidden', marginTop: 14 }}>
                    <LinearGradient colors={tier.actionColor}
                      style={{ paddingVertical: 12, alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontWeight: '700',
                        fontSize: 13, letterSpacing: 1 }}>
                        {tier.actionLabel}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </View>
          );
        })}

        {/* Linklər */}
        <View style={{ backgroundColor: C.card, borderRadius: 16,
          borderWidth: 1, borderColor: C.border, padding: 16, marginTop: 4 }}>
          <Text style={{ color: C.muted, fontSize: 10, letterSpacing: 3,
            marginBottom: 12 }}>SOSIAL MEDIA</Text>
          <TouchableOpacity onPress={() => Linking.openURL(YOUTUBE_URL)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12,
              paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
            <Text style={{ fontSize: 20 }}>▶️</Text>
            <View>
              <Text style={{ color: C.text, fontWeight: '700', fontSize: 13 }}>YouTube Kanalı</Text>
              <Text style={{ color: C.muted, fontSize: 11 }}>youtube.com/@eva.z</Text>
            </View>
            <Text style={{ color: C.muted, marginLeft: 'auto' }}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(TIKTOK_URL)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
            <Text style={{ fontSize: 20 }}>🎵</Text>
            <View>
              <Text style={{ color: C.text, fontWeight: '700', fontSize: 13 }}>TikTok Səhifəsi</Text>
              <Text style={{ color: C.muted, fontSize: 11 }}>tiktok.com/@e._.v._.a</Text>
            </View>
            <Text style={{ color: C.muted, marginLeft: 'auto' }}>→</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ textAlign: 'center', color: C.muted, fontSize: 10,
          letterSpacing: 1, paddingBottom: 20 }}>
          Bonuslar hər gün gecə sıfırlanır
        </Text>
      </ScrollView>
    </View>
  );
}
