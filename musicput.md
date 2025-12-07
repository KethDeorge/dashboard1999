
# How to Organize Your Music // DeskBoard 1999

The Music Player supports 3 distinct categories. Follow the instructions below to organize your files.

## 1. Directory Structure

Go to your project folder: `public/music`.
You should place your audio files here.

**Supported Formats:** `.mp3`, `.m4a` (AAC), `.wav`, `.ogg`.

```
/public
  /music
    test.mp3
    1_1Morning(Clear).mp3
    3_1Stultifera_Navis.m4a
    ... and so on
```

## 2. Updated File List

### A. LIGHT (Radio)
*   `1_1Morning(Clear).mp3`
*   `1_2Morning_Light_Rain.mp3`
*   ... (up to 1_13)

### B. OST (Archive)
*   `ost_1.mp3`
*   `ost_2.mp3`

### C. ARKNIGHTS (Cassette)
*   `3_1Stultifera_Navis.m4a`
*   `3_2Here_in_Vernal_Terrene.m4a`
*   `3_3Epilogue.m4a`
*   `3_4A_Toda_Vela.m4a`
*   `3_5March_of_Gobbling_Howls.m4a`
*   `3_6Mystic_Light_Quest.m4a`
*   `3_7Awaken.m4a`
*   `3_8Requiem.m4a`
*   `3_9Renegade.m4a`
*   `3_10Endospore.m4a`
*   `3_11ManiFesto.m4a`

## 3. Troubleshooting

*   **File Not Found:** If you see `ERR:4` in the SysLog, check the filename spelling. Spaces and underscores matter!
*   **Format Issue:** If you see `ERR:3 (DECODE)`, the file might be corrupted or use an unsupported codec.
