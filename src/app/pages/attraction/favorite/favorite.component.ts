import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Attraction } from '../../../core/models/attraction.model';
import { AttractionUiService } from '../services/attraction-ui.service';

@Component({
  selector: 'app-favorite',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit, OnDestroy {
  favorites: Attraction[] = [];
  displayedFavorites: Attraction[] = [];
  selectedFavorites: Set<number> = new Set();

  currentPage = 1;
  pageSize = 30;
  totalPages = 1;

  editingId: number | null = null;
  editForm: FormGroup;

  private destroy$ = new Subject<void>();

  get formControls() {
    return this.editForm.controls;
  }

  constructor(
    private attractionUiService: AttractionUiService,
    private fb: FormBuilder
  ) {
    // 初始化編輯表單
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      tel: ['', [this.phoneValidator]],
      introduction: ['']
    });
  }

  ngOnInit(): void {
    this.loadFavorites();

    // 訂閱我的最愛變更
    this.attractionUiService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadFavorites();
      });
  }

  private phoneValidator(control: any) {
    if (!control.value) return null;

    const chineseRegex = /[\u4e00-\u9fa5]/;
    if (chineseRegex.test(control.value)) {
      return { containsChinese: true };
    }

    return null;
  }

  loadFavorites(): void {
    this.favorites = this.attractionUiService.getFavorites();
    this.totalPages = Math.ceil(this.favorites.length / this.pageSize);

    // 確保當前頁面不超過總頁數
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    this.updateDisplayedFavorites();
  }

  updateDisplayedFavorites(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedFavorites = this.favorites.slice(start, end);
  }

  startEdit(attraction: Attraction): void {
    this.editingId = attraction.id;
    this.editForm.patchValue({
      name: attraction.name,
      address: attraction.address || '',
      tel: attraction.tel || '',
      introduction: attraction.introduction || ''
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editForm.reset();
  }

  saveEdit(attraction: Attraction): void {
    if (this.editForm.invalid) {
      this.markFormGroupTouched(this.editForm);
      return;
    }

    const updatedAttraction: Attraction = {
      ...attraction,
      ...this.editForm.value
    };

    this.attractionUiService.updateFavorite(updatedAttraction);
    this.editingId = null;
    this.editForm.reset();
  }

  isEditing(attractionId: number): boolean {
    return this.editingId === attractionId;
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
