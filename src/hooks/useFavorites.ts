"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'tastebook_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      if (item) {
        setFavorites(JSON.parse(item));
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage", error);
      setFavorites([]);
    }
  }, []);

  const updateFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
       console.error("Failed to save favorites to localStorage", error);
    }
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    const newFavorites = favorites.includes(slug)
      ? favorites.filter((fav) => fav !== slug)
      : [...favorites, slug];
    updateFavorites(newFavorites);
  }, [favorites, updateFavorites]);

  const isFavorite = useCallback((slug: string) => {
    return favorites.includes(slug);
  }, [favorites]);

  // Return an empty array until the component has mounted to avoid hydration mismatch
  const safeFavorites = isMounted ? favorites : [];

  return { favorites: safeFavorites, toggleFavorite, isFavorite, isMounted };
}
