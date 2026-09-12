"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { RecentSource, SourceType } from "./types";

const STORAGE_KEY = "research-assistant:recent-sources";
const MAX_ITEMS = 8;
const STORAGE_EVENT = "research-assistant:recent-sources-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot() {
  return null;
}

function parseItems(raw: string | null): RecentSource[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as RecentSource[] : [];
  } catch {
    return [];
  }
}

/**
 * Tracks recently analyzed sources in the browser's localStorage.
 *
 * This is intentionally client-only: the backend has no database, so rather
 * than fabricate a "history" feature, we persist a small, honest, local list
 * of what this browser has processed. It resets if the user clears site
 * data, and is never sent anywhere.
 */
export function useRecentSources() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = parseItems(raw);

  const persist = useCallback((next: RecentSource[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      // Storage full or unavailable — degrade silently, it's non-critical.
    }
  }, []);

  const addSource = useCallback(
    (title: string, type: SourceType | string) => {
      persist(
        [
          { id: crypto.randomUUID(), title, type, addedAt: Date.now() },
          ...items.filter((item) => item.title !== title),
        ].slice(0, MAX_ITEMS)
      );
    },
    [items, persist]
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { items, hydrated: true, addSource, clear };
}
