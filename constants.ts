import { PageId } from './types';

export const PAGES = [PageId.TIME, PageId.FOCUS, PageId.TASKS, PageId.MUSIC];

export const DEFAULT_FOCUS_TIME = 25 * 60; // 25 minutes
export const DEFAULT_BREAK_TIME = 5 * 60; // 5 minutes

export const MOCK_WEATHER = {
  temp: 21,
  condition: 'Rainy'
};