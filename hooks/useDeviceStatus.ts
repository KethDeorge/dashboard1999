import { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import type { DeviceStatus } from '../types';

const WEATHER_LABELS: Record<number, string> = {
  0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle',
  55: 'Heavy Drizzle', 56: 'Freezing Drizzle', 57: 'Heavy Freezing Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 66: 'Freezing Rain',
  67: 'Heavy Freezing Rain', 71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
  77: 'Snow Grains', 80: 'Rain Showers', 81: 'Heavy Showers',
  82: 'Violent Showers', 85: 'Snow Showers', 86: 'Heavy Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm / Hail', 99: 'Heavy Thunderstorm',
};

const initialStatus: DeviceStatus = {
  batteryPercent: null,
  isCharging: null,
  isOnline: navigator.onLine,
  connectionType: 'unknown',
  latencyMs: null,
  memoryPercent: null,
  weather: null,
  weatherState: 'loading',
};

export const useDeviceStatus = (): DeviceStatus => {
  const [status, setStatus] = useState<DeviceStatus>(initialStatus);

  useEffect(() => {
    let disposed = false;
    let networkListener: PluginListenerHandle | undefined;

    const updateBattery = async () => {
      try {
        const info = await Device.getBatteryInfo();
        if (!disposed) {
          setStatus(prev => ({
            ...prev,
            batteryPercent: info.batteryLevel == null ? null : Math.round(info.batteryLevel * 100),
            isCharging: info.isCharging ?? null,
          }));
        }
      } catch {
        if (!disposed) setStatus(prev => ({ ...prev, batteryPercent: null, isCharging: null }));
      }
    };

    const updateMemory = () => {
      const memory = (performance as Performance & {
        memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
      }).memory;
      const memoryPercent = memory?.jsHeapSizeLimit
        ? Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
        : null;
      if (!disposed) setStatus(prev => ({ ...prev, memoryPercent }));
    };

    const updateWeather = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const existing = await Geolocation.checkPermissions();
          let permission = existing.location;
          if (permission === 'prompt' || permission === 'prompt-with-rationale') {
            const requested = await Geolocation.requestPermissions({ permissions: ['location'] });
            permission = requested.location;
          }
          if (permission === 'denied') throw new Error('Location permission denied');
        }
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10 * 60 * 1000,
        });
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.set('latitude', String(position.coords.latitude));
        url.searchParams.set('longitude', String(position.coords.longitude));
        url.searchParams.set('current', 'temperature_2m,weather_code');
        url.searchParams.set('timezone', 'auto');

        const startedAt = performance.now();
        const response = await fetch(url, { cache: 'no-store' });
        const latencyMs = Math.max(1, Math.round(performance.now() - startedAt));
        if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
        const payload = await response.json();
        const current = payload.current;
        if (typeof current?.temperature_2m !== 'number' || typeof current?.weather_code !== 'number') {
          throw new Error('Invalid weather response');
        }
        if (!disposed) {
          setStatus(prev => ({
            ...prev,
            latencyMs,
            weather: {
              temp: Math.round(current.temperature_2m),
              condition: WEATHER_LABELS[current.weather_code] ?? `Code ${current.weather_code}`,
            },
            weatherState: 'ready',
          }));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message.toLowerCase() : '';
        const denied = message.includes('denied') || message.includes('permission');
        if (!disposed) {
          setStatus(prev => ({
            ...prev,
            weather: null,
            weatherState: denied ? 'denied' : 'unavailable',
          }));
        }
      }
    };

    const setupNetwork = async () => {
      try {
        const current = await Network.getStatus();
        if (!disposed) {
          setStatus(prev => ({
            ...prev,
            isOnline: current.connected,
            connectionType: current.connectionType,
          }));
        }
        networkListener = await Network.addListener('networkStatusChange', next => {
          setStatus(prev => ({
            ...prev,
            isOnline: next.connected,
            connectionType: next.connectionType,
            latencyMs: next.connected ? prev.latencyMs : null,
          }));
          if (next.connected) void updateWeather();
        });
      } catch {
        if (!disposed) {
          setStatus(prev => ({ ...prev, isOnline: navigator.onLine, connectionType: 'unknown' }));
        }
      }
    };

    void updateBattery();
    void setupNetwork();
    void updateWeather();
    updateMemory();

    const batteryTimer = window.setInterval(updateBattery, 60_000);
    const weatherTimer = window.setInterval(updateWeather, 15 * 60_000);
    const memoryTimer = window.setInterval(updateMemory, 5_000);

    return () => {
      disposed = true;
      window.clearInterval(batteryTimer);
      window.clearInterval(weatherTimer);
      window.clearInterval(memoryTimer);
      void networkListener?.remove();
    };
  }, []);

  return status;
};
