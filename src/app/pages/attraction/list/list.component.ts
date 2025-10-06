import { Component, OnDestroy, OnInit } from '@angular/core';
import { AttractionService } from './services/attraction.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { Attraction } from '../../../core/models/attraction.model';
// import { MOCK_ATTRACTIONS } from '../../../../assets/mock-data/attractions.mock';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { KeyValueItem } from '../../../core/models/category.model';

@Component({
  selector: 'app-list',
  imports: [FormsModule],
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

  categories: KeyValueItem[] = [];
  selectedCategory = 'all';

  private destroy$ = new Subject<void>();

  constructor(
    private attractionService: AttractionService
  ) { }

  ngOnInit(): void {
    this.loadAttractions();
    this.loadCategories();
    // this.attractions = MOCK_ATTRACTIONS.data;
  }

  /**
   * 載入景點列表
   */
  loadAttractions(): void {
    this.loading = true;
    this.clearList();

    this.attractionService.getAttractions(this.currentPage, this.selectedCategory)
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

  /**
   * 載入分類列表
   */
  loadCategories(): void {
    this.attractionService.getCategories('Attractions')
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.categories = value.data.Category ? value.data.Category : [];
      });
  }

  /**
 * 切換分類
 */
  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadAttractions();
  }

  clearList(): void {
    this.attractions = [];
    this.totalCount = 0;
    this.totalPages = 1;
    this.currentPage = 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
