// ─── Integration Service: Google Maps Platform API ──────────────────────────────
// Interfacing with official Google Maps Geocoding & Places REST API: https://maps.googleapis.com/maps/api
// Server-side API key authentication & 15-minute memory caching.

import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

const API_BASE = 'https://maps.googleapis.com/maps/api';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export interface MapsGeocodeResult {
  formattedAddress: string;
  location: { lat: number; lng: number };
  placeId: string;
  types: string[];
}

export interface MapsPlaceDetailsResult {
  placeId: string;
  name: string;
  formattedAddress: string;
  location: { lat: number; lng: number };
  url?: string;
  rating?: number;
  userRatingsTotal?: number;
}

export class MapsIntegrationService {
  private static getCredentials() {
    const apiKey = (process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_SERVER_API_KEY)?.trim();
    const hasCreds = Boolean(apiKey && apiKey.length > 0);
    return { apiKey, hasCreds };
  }

  public static async verify(): Promise<ProviderHealthResult> {
    const { apiKey, hasCreds } = this.getCredentials();
    const start = Date.now();

    if (!hasCreds) {
      return {
        id: 'gmaps',
        name: 'Google Maps Places API',
        category: 'SEO',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1',
        docsUrl: 'https://developers.google.com/maps',
        message: 'Authentication Required. Configure GOOGLE_MAPS_API_KEY in server/.env.',
        configured: false,
      };
    }

    try {
      const res = await axios.get(`${API_BASE}/geocode/json?address=Kochi,India&key=${apiKey}`, { timeout: 8000 });
      const latencyMs = Math.max(1, Date.now() - start);
      const isSuccess = res.data.status === 'OK' || res.data.status === 'ZERO_RESULTS';

      return {
        id: 'gmaps',
        name: 'Google Maps Places API',
        category: 'SEO',
        status: isSuccess ? 'connected' : 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1',
        docsUrl: 'https://developers.google.com/maps',
        message: isSuccess
          ? 'Google Maps API key verified & active.'
          : `API Status: ${res.data.status} (${res.data.error_message || 'Key invalid'})`,
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'gmaps',
        name: 'Google Maps Places API',
        category: 'SEO',
        status: 'auth_required',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1',
        docsUrl: 'https://developers.google.com/maps',
        message: `Google Maps Verification Notice: ${err.response?.data?.error_message || err.message}`,
        configured: true,
      };
    }
  }

  public static async geocodeAddress(address: string): Promise<{ configured: boolean; data?: MapsGeocodeResult; message?: string }> {
    const { apiKey, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure GOOGLE_MAPS_API_KEY in server/.env' };

    const cacheKey = `geocode_${address.toLowerCase().trim()}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const res = await axios.get(`${API_BASE}/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`, { timeout: 8000 });
      if (res.data.status !== 'OK' || !res.data.results?.[0]) {
        return { configured: true, message: `Geocoding Status: ${res.data.status}` };
      }

      const r = res.data.results[0];
      const data: MapsGeocodeResult = {
        formattedAddress: r.formatted_address,
        location: {
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
        },
        placeId: r.place_id,
        types: r.types || [],
      };

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error_message || err.message };
    }
  }

  public static async reverseGeocode(lat: number, lng: number): Promise<{ configured: boolean; data?: MapsGeocodeResult; message?: string }> {
    const { apiKey, hasCreds } = this.getCredentials();
    if (!hasCreds) return { configured: false, message: 'Configure GOOGLE_MAPS_API_KEY in server/.env' };

    const cacheKey = `rev_geocode_${lat}_${lng}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const res = await axios.get(`${API_BASE}/geocode/json?latlng=${lat},${lng}&key=${apiKey}`, { timeout: 8000 });
      if (res.data.status !== 'OK' || !res.data.results?.[0]) {
        return { configured: true, message: `Reverse Geocoding Status: ${res.data.status}` };
      }

      const r = res.data.results[0];
      const data: MapsGeocodeResult = {
        formattedAddress: r.formatted_address,
        location: { lat, lng },
        placeId: r.place_id,
        types: r.types || [],
      };

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.error_message || err.message };
    }
  }
}
