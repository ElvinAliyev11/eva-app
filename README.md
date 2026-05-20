# EVA Super App — APK Qurma Təlimatı

## Tələb olunanlar
- Windows / Mac / Linux kompüter
- İnternet bağlantısı

---

## ADDIM 1 — Node.js yüklə
https://nodejs.org saytına get → "LTS" versiyasını yüklə → qur.
Yoxlama: terminal/CMD-də yaz:
```
node --version
```
v18 və ya yuxarı çıxmalıdır.

---

## ADDIM 2 — Expo və EAS yüklə
```
npm install -g expo-cli eas-cli
```

---

## ADDIM 3 — Bu qovluğu açın
Bu `EVA` qovluğunu kompüterə köçür, sonra terminaldə:
```
cd EVA
npm install
```
(3-5 dəqiqə çəkir)

---

## ADDIM 4 — Expo hesabı yarat (pulsuz)
https://expo.dev/signup

Sonra terminaldə:
```
eas login
```
E-mail və şifrəni daxil et.

---

## ADDIM 5 — Testi telefonda gör (APK olmadan)
Telefonuna **Expo Go** yüklə (Play Store).
Terminaldə:
```
npx expo start
```
QR kodu Expo Go ilə skanlə et — tətbiq açılır!

---

## ADDIM 6 — Real APK yarat
```
eas build -p android --profile preview
```
- İlk dəfə bəzi suallar soruşacaq → hamısına Enter bas (default)
- 10-15 dəqiqə gözlə
- Bitdikdə **APK link** verir → yüklə → telefona qur!

---

## Qurarkən "Naməlum mənbə" xəbərdarlığı çıxarsa:
Telefon Ayarları → Təhlükəsizlik → Naməlum mənbələrə icazə ver

---

## Problemlər üçün
expo.dev/docs — rəsmi sənədlər
