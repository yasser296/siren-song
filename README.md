# Siren Song — APK Android (Capacitor)

Cette app Vite + React peut être packagée en APK Android avec Capacitor.

## 1) Pré-requis

- Node.js 20+
- Android Studio (SDK/Platform Tools)
- **JDK 17 recommandé** (important pour éviter les erreurs Gradle/JVM)

## 2) Installation

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
```

## 3) Génération du projet Android

```bash
npm run build
npx cap add android
npx cap sync android
```

Puis ouvrir Android Studio :

```bash
npm run mobile:open
```

## 4) Générer l’APK

Dans Android Studio:

- `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- APK debug attendu : `android/app/build/outputs/apk/debug/app-debug.apk`

Installation USB :

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Dépannage (important)

### A. Erreur `Incompatible Gradle JVM` / `Unsupported class file major version 65`

Si tu vois une erreur comme :
- `Java 21 ... incompatible with Gradle 8.2.1`
- `The maximum compatible Gradle JVM version is 19`
- `Unsupported class file major version 65`

alors Android Studio utilise une JVM trop récente pour le wrapper Gradle du projet.

**Solution recommandée : passer Gradle JDK en Java 17**

1. Android Studio → `File > Settings > Build, Execution, Deployment > Build Tools > Gradle`
2. `Gradle JDK` → sélectionner **jbr-17** ou un **JDK 17** installé
3. Re-sync (`Sync Project with Gradle Files`)

Option terminal (Windows PowerShell) :

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
```

Puis relancer la sync/build Android.

### B. Warning Vite: `"type": "ok" is not a valid value for the "type" field`

Ce warning vient d’un **`package.json` parent** (ex: `C:\Users\...\package.json`), pas forcément celui du repo `siren-song`.

Corrige le fichier parent en mettant :

```json
"type": "module"
```
ou
```json
"type": "commonjs"
```

### C. `sync could not run--missing dist directory`

Tu as lancé `npx cap add android` avant `npm run build`.

Ordre correct :

```bash
npm run build
npx cap sync android
```

---

## Scripts disponibles

- `npm run mobile:build` → build web + sync Android
- `npm run mobile:sync` → sync Android
- `npm run mobile:open` → ouvre le projet Android
