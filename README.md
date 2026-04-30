# Siren Song — Build Android APK

Ce projet est une application web Vite + React. Pour la transformer en application mobile Android (APK installable), le chemin recommandé est **Capacitor**.

## 1) Pré-requis (sur ta machine)

- Node.js 20+
- Android Studio (SDK + Build Tools + platform-tools)
- Java 17 (ou version demandée par ton Android Gradle Plugin)

## 2) Installer Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

> Si ton environnement bloque npm (ex: registre privé), fais l’installation sur une machine/devbox qui a accès au registry npm public.

## 3) Initialiser le conteneur mobile

Le fichier `capacitor.config.ts` est déjà prêt dans ce repo.

Ensuite, exécute :

```bash
npx cap add android
```

Cela génère le dossier `android/` (projet Android natif).

## 4) Build web + sync Android

```bash
npm run build
npx cap sync android
```

(équivalent rapide via script)

```bash
npm run mobile:build
```

## 5) Ouvrir Android Studio

```bash
npm run mobile:open
```

Dans Android Studio :

1. Laisser Gradle sync se terminer
2. `Build > Build Bundle(s) / APK(s) > Build APK(s)`
3. Récupérer l’APK ici en général :
   `android/app/build/outputs/apk/debug/app-debug.apk`

## 6) Installer l’APK sur ton téléphone

### Option A — via USB (ADB)

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Option B — manuellement

- Copier `app-debug.apk` sur le téléphone
- L’ouvrir depuis le gestionnaire de fichiers
- Autoriser l’installation depuis source inconnue si nécessaire

## Scripts ajoutés

- `npm run mobile:build` → build web + sync android
- `npm run mobile:sync` → sync uniquement
- `npm run mobile:open` → ouvre le projet Android

## Notes

- Pour une version production, génère un APK/ABB **signé** via Android Studio.
- Si tu veux, je peux aussi te préparer la configuration de signature (`keystore`) et un script CI pour générer l’APK automatiquement.
