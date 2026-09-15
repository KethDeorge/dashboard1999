
import { PageId } from './types';

export const PAGES = [PageId.TIME, PageId.FOCUS, PageId.TASKS, PageId.MUSIC];

export const DEFAULT_FOCUS_TIME = 25 * 60; // 25 minutes
export const DEFAULT_BREAK_TIME = 5 * 60; // 5 minutes

// Retro 1999 Style Database - 3 Categories
export const OST_DATABASE = [
  {
    id: 'LGT',
    label: 'RADIO // LIGHT',
    tracks: [
      { id: '1.1', title: 'Morning', artist: 'Clear', filename: '1_1Morning(Clear).mp3' },
      { id: '1.2', title: 'Morning', artist: 'Light Rain', filename: '1_2Morning_Light_Rain.mp3' },
      { id: '1.3', title: 'Morning', artist: 'Heavy Rain', filename: '1_3Morning_Heavy_Rain.mp3' },
      { id: '1.4', title: 'Dusk', artist: 'Clear', filename: '1_4Dusk(Clear).mp3' },
      { id: '1.5', title: 'Dusk', artist: 'Light Rain', filename: '1_5Dusk_Light_Rain.mp3' },
      { id: '1.6', title: 'Nightfall', artist: 'Mystery', filename: '1_6Nightfall_Mystery.mp3' },
      { id: '1.7', title: 'Nightfall', artist: 'Light Rain', filename: '1_7Nightfall_Light_Rain.mp3' },
      { id: '1.8', title: 'Nightfall', artist: 'Heavy Rain', filename: '1_8Nightfall_Heavy_Rain.mp3' },
      { id: '1.9', title: 'Overcast', artist: 'Light Rain', filename: '1_9Overcast_Light_Rain.mp3' },
      { id: '1.10', title: 'Overcast', artist: 'Heavy Rain', filename: '1_10Overcast_Heavy_Rain.mp3' },
      { id: '1.11', title: 'Overcast', artist: 'Torrential', filename: '1_11Overcast_Torrential_Rain.mp3' },
      { id: '1.12', title: 'Overcast', artist: 'Dense Fog', filename: '1_12Overcast_Dense_Fog.mp3' },
      { id: '1.13', title: 'Overcast', artist: 'Light Snow', filename: '1_13Overcast_Light_Snow.mp3' },
    ]
  },
  {
    id: 'OST',
    label: 'ARCHIVE // OST',
    tracks: [
      { 
        id: '2.1', 
        title: 'The Storm', 
        artist: 'Adam Gubman', 
        filename: 'ost_1.mp3' 
      },
      { 
        id: '2.2', 
        title: 'Satin Matin', 
        artist: 'Vertin', 
        filename: 'ost_2.mp3' 
      }
    ]
  },
  {
    id: 'ARK',
    label: 'CASSETTE // ARKNIGHTS',
    tracks: [
      { id: '3.1', title: 'Stultifera Navis', artist: 'M.S.R', filename: '3_1Stultifera_Navis.m4a' },
      { id: '3.2', title: 'Here in Vernal Terrene', artist: 'M.S.R', filename: '3_2Here_in_Vernal_Terrene.m4a' },
      { id: '3.3', title: 'Epilogue', artist: 'M.S.R', filename: '3_3Epilogue.m4a' },
      { id: '3.4', title: 'A Toda Vela', artist: 'M.S.R', filename: '3_4A_Toda_Vela.m4a' },
      { id: '3.5', title: 'March of Gobbling Howls', artist: 'M.S.R', filename: '3_5March_of_Gobbling_Howls.m4a' },
      { id: '3.6', title: 'Mystic Light Quest', artist: 'M.S.R', filename: '3_6Mystic_Light_Quest.m4a' },
      { id: '3.7', title: 'Awaken', artist: 'M.S.R', filename: '3_7Awaken.m4a' },
      { id: '3.8', title: 'Requiem', artist: 'M.S.R', filename: '3_8Requiem.m4a' },
      { id: '3.9', title: 'Renegade', artist: 'M.S.R', filename: '3_9Renegade.m4a' },
      { id: '3.10', title: 'Endospore', artist: 'M.S.R', filename: '3_10Endospore.m4a' },
      { id: '3.11', title: 'ManiFesto', artist: 'M.S.R', filename: '3_11ManiFesto.m4a' },
    ]
  }
];
