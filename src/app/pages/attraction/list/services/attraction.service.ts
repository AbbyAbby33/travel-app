import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiResponse } from '../../../../core/models/general.model';
import { Attraction } from '../../../../core/models/attraction.model';
import { CategoriesData, CategoriesResponse } from '../../../../core/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class AttractionService {
  // private readonly API_URL = 'https://www.travel.taipei/open-api';
  private readonly API_URL = 'https://travel-app-backend-self.vercel.app/api';
  private readonly LANG = 'zh-tw';

  constructor(private http: HttpClient) { }

  /**
   * 取得景點列表
   */
  getAttractions(page: number = 1, categoryId: string): Observable<ApiResponse<Attraction>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    let params = new HttpParams().set('page', page.toString());
    if (categoryId && categoryId !== 'all') {
      params = params.set('categoryIds', categoryId);
    }
    
    return this.http.get<ApiResponse<Attraction>>(`${this.API_URL}/${this.LANG}/Attractions/All?${params.toString()}`, { headers })
      .pipe(
        map(response => ({
          total: response.total || 0,
          data: response.data || []
        })),
        catchError(error => {
          console.error('Error fetching attractions:', error);
          return of({ total: 0, data: [] });
        })
      );
  }

  /**
   * 取得分類列表
   */
  getCategories(type: string): Observable<CategoriesResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams().set('type', type);

    return this.http.get<CategoriesResponse>(
      `${this.API_URL}/${this.LANG}/Miscellaneous/Categories?${params.toString()}`,
      { headers }
    )
      .pipe(
        map(response => {
          const data = response.data || {};
          const processedData: CategoriesData = {};

          // 在 Category 前加全部分類
          if (data.Category) {
            processedData.Category = [
              { id: 'all', name: '全部分類' },
              ...data.Category
            ];
          }

          return {
            total: response.total || 0,
            data: processedData
          };
        }),
        catchError(error => {
          console.error('Error fetching categories:', error);
          return of({
            total: 0, data: {
              Category: [],
              Friendly: [],
              Services: [],
              Target: []
            }
          });
        })
      );
  }

}
