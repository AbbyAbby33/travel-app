import { Component, OnDestroy, OnInit } from '@angular/core';
import { AttractionService } from './services/attraction.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { Attraction } from '../../../core/models/attraction.model';
// import { MOCK_ATTRACTIONS } from '../../../../assets/mock-data/attractions.mock';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {
  attractions: Attraction[] = [];

  // 分頁
  currentPage = 1;
  totalPages = 1;
  pageSize = 12;

  totalCount = 0;
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private attractionService: AttractionService
  ) { }

  ngOnInit(): void {
    this.loadAttractions();
    // this.attractions = MOCK_ATTRACTIONS.data;
  }

  /**
   * 載入景點列表
   */
  loadAttractions(): void {
    this.loading = true;
    this.attractionService.getAttractions(this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.attractions = response.data;
          this.totalCount = response.total;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          this.loading = false;
        },
        error: (error) => {
          console.error('error:', error);
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
