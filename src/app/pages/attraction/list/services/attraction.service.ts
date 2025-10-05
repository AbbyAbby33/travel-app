import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiResponse } from '../../../../core/models/general.model';
import { Attraction } from '../../../../core/models/attraction.model';

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
  getAttractions(page: number = 1): Observable<ApiResponse<Attraction>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams().set('page', page.toString());

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

}
