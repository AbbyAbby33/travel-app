import { Component, OnDestroy, OnInit } from '@angular/core';
import { AttractionService } from '../services/attraction.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { Attraction } from '../../../core/models/attraction.model';
// import { MOCK_ATTRACTIONS } from '../../../../assets/mock-data/attractions.mock';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { KeyValueItem } from '../../../core/models/category.model';
import { AttractionUiService } from '../services/attraction-ui.service';

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
  pageSize = 30;

  totalCount = 0;
  loading = false;

  categories: KeyValueItem[] = [];
  selectedCategory = 'all';

  selectedAttractions: Set<number> = new Set();

  private destroy$ = new Subject<void>();

  constructor(
    private attractionService: AttractionService,
    private attractionUiService: AttractionUiService
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
    this.selectedAttractions.clear();

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
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAttractions();
      this.scrollToTop();
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAttractions();
      this.scrollToTop();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAttractions();
      this.scrollToTop();
    }
  }

  getPageRange(): number[] {
    const range: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  isFavorite(attractionId: number): boolean {
    return this.attractionUiService.isFavorite(attractionId);
  }

  isSelected(attractionId: number): boolean {
    return this.selectedAttractions.has(attractionId);
  }

  toggleSelection(attractionId: number): void {
    if (this.selectedAttractions.has(attractionId)) {
      this.selectedAttractions.delete(attractionId);
    } else {
      this.selectedAttractions.add(attractionId);
    }
    console.log('this.selectedAttractions:', this.selectedAttractions);
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedAttractions.clear();
    } else {
      this.attractions
        .filter(attr => !this.isFavorite(attr.id)) // 排除已是最愛
        .forEach(attr => this.selectedAttractions.add(attr.id));
    }
  }

  isAllSelected(): boolean {
    // 只檢查未加入最愛的景點是否都被選取
    const selectable = this.attractions.filter(attr => !this.isFavorite(attr.id));
    return selectable.length > 0 &&
      selectable.every(attr => this.selectedAttractions.has(attr.id));
  }

  addSelectedToFavorites(): void {
    const selectedItems = this.attractions.filter(
      attr => this.selectedAttractions.has(attr.id)
    );

    if (selectedItems.length > 0) {
      this.attractionUiService.addMultipleToFavorites(selectedItems);
      this.selectedAttractions.clear();
      alert(`成功加入${selectedItems.length}個景點到我的最愛`);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
