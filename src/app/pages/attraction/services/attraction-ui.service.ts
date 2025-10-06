import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Attraction } from '../../../core/models/attraction.model';

@Injectable({
  providedIn: 'root'
})
export class AttractionUiService {

  private favoritesSubject = new BehaviorSubject<Attraction[]>(this.loadFavorites());
  public favorites$ = this.favoritesSubject.asObservable();

  constructor() { }

  /**
   * 取得當前我的最愛列表
   */
  getFavorites(): Attraction[] {
    return this.favoritesSubject.value;
  }

  /**
   * 檢查景點是否在我的最愛中
   */
  isFavorite(attractionId: number): boolean {
    return this.favoritesSubject.value.some(fav => fav.id === attractionId);
  }

  /**
   * 批次新增到我的最愛
   */
  addMultipleToFavorites(attractions: Attraction[]): void {
    const currentFavorites = this.getFavorites();
    const newFavorites = attractions.filter(
      attr => !this.isFavorite(attr.id)
    );

    if (newFavorites.length > 0) {
      const updatedFavorites = [...currentFavorites, ...newFavorites];
      this.saveFavorites(updatedFavorites);
    }
  }

  /**
   * 載入我的最愛 (從 localStorage)
   */
  private loadFavorites(): Attraction[] {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  /**
   * 儲存我的最愛 (到 localStorage)
   */
  private saveFavorites(favorites: Attraction[]): void {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.favoritesSubject.next(favorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  /**
   * 更新我的最愛中的景點資料
   */
    updateFavorite(updatedAttraction: Attraction): void {
    const currentFavorites = this.getFavorites();
    const index = currentFavorites.findIndex(fav => fav.id === updatedAttraction.id);

    if (index !== -1) {
      currentFavorites[index] = updatedAttraction;
      this.saveFavorites([...currentFavorites]);
    }
  }
}
