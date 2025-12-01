
# How to Organize Your Music // DeskBoard 1999

The Music Player supports 3 distinct categories. Follow the instructions below to organize your files.

## 1. Directory Structure

Go to your project folder: `public/music`.
You should place your MP3 files here.

```
/public
  /music
    test.mp3
    ost_1.mp3
    ost_2.mp3
    light_1.mp3
    fav_1.mp3
    ...
```

## 2. Naming Convention

You can name your files whatever you want, but you must update the code to match. 
It is easier if you use simple names.

**Suggested Naming:**
*   **OST Tracks:** `ost_1.mp3`, `ost_2.mp3`
*   **Light Music:** `light_1.mp3`, `light_2.mp3`
*   **Personal:** `personal_1.mp3`, `fav_1.mp3`

## 3. Updating the Database Code

Open `src/pages/MusicPage.tsx` and find `OST_DATABASE`.
It looks like this:

```typescript
const OST_DATABASE = [
  {
    id: 'OST',
    label: 'ARCHIVE // OST',
    tracks: [
       // Add your OST files here
      { id: '1.1', title: 'Song Name', artist: 'Artist', filename: 'ost_1.mp3' },
    ]
  },
  {
    id: 'LGT',
    label: 'RADIO // LIGHT',
    tracks: [
       // Add your Light Music files here
      { id: '2.1', title: 'Rain Sound', artist: 'Nature', filename: 'light_1.mp3' },
    ]
  },
  {
    id: 'PVT',
    label: 'CASSETTE // PERSONAL',
    tracks: [
       // Add your Personal songs here
      { id: '3.1', title: 'My Song', artist: 'Me', filename: 'fav_1.mp3' },
    ]
  }
];
```

**Important:**
1. The `filename` must match exactly what is in the `public/music` folder.
2. If the filename is wrong, the Diagnostic Terminal will show `HTTP: 404 (MISSING)`.
