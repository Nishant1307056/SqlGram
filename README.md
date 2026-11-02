# Learning SQL from Scratch (free installable app)

A PWA: it installs on Android from the browser and works offline. No store fee, no server, no paid service.

## Put it online for free (GitHub Pages)
1. Create a free account at github.com and a new **public** repository.
2. Upload every file in this folder (index.html, manifest.json, sw.js, icon-192.png, icon-512.png).
3. Repository Settings > Pages > Build from branch `main`, folder `/ (root)`. After a minute you get `https://YOURNAME.github.io/REPO/`.
   (Cloudflare Pages and Netlify also have free plans.)

## Install on Android
Open the link in Chrome > menu (three dots) > **Install app** (or Add to Home screen). It opens full screen like an app and works offline after the first visit.

## Optional: Google sign-in (still free)
1. console.firebase.google.com > create a project on the free **Spark** plan > add a Web app and copy its config.
2. Authentication > Sign-in method > enable **Google**. Under Settings > Authorized domains add `YOURNAME.github.io`.
3. Paste the config values into `FB` near the bottom of index.html and upload the file again. The Google button then appears.

## Not included
Phone number OTP: sending SMS costs money on every provider I know of (Firebase needs a paid plan for it). Use Google sign-in or the no-account mode for now.

## Notes
Likes and saves are stored on the device. Syncing across devices would need a database (Firestore has a free quota).
