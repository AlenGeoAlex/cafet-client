import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ICategory} from "../../../domain/ICategory";
import {ConfirmationService} from "primeng/api";
import {CategoryService} from "../category.service";

@Component({
  selector: 'app-cat-view',
  templateUrl: './cat-view.component.html',
  styleUrls: ['./cat-view.component.scss']
})
export class CatViewComponent implements OnInit {

  @Input() category : ICategory[];
  @Output() catDelete = new EventEmitter();
  @Output() catUpdate = new EventEmitter<ICategory | null>();
  @Output() catUpdateCancelled = new EventEmitter<ICategory>();

  first = 0;

  rows = 10;

  localCache = new Map<number, ICategory>();

  constructor(private readonly catService: CategoryService,private readonly confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }


  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.category ? this.first === (this.category.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.category ? this.first === 0 : true;
  }

  onDelete(product: ICategory){
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete the category ${product.categoryName} [${product.id}]?`,
      accept: () => {
        this.catService.deleteCategory(product.id).subscribe({
          next: value => {
            this.catDelete.emit(true);
          },
          error: err => {
            this.catDelete.emit(false);
            console.log(err);
          },
          complete: () => {

          }
        })
      }
    });
  }

  onRowEditInit(product: ICategory) {
    this.localCache.set(product.id, product);/*
    localStorage.setItem("TEST_DATA",product.id.toString());
    console.log(localStorage.getItem("TEST_DATA"));*/
  }

  onRowEditSave(product: ICategory) {
    if(this.validateString(product.categoryName) && this.validateString(product.categoryDescription)){
      this.catService.updateCategory(product).subscribe({
        next: value => {
          this.localCache.delete(product.id);
          this.catUpdate.emit(product);
        },
        error: err => {
          this.catUpdate.emit(null);
        },
        complete: () => {

        }
      })
    }else{
      this.catUpdate.emit(null);
    }
  }

  private validateString(strin: string) : boolean {
    return strin.length > 0
  }

  onRowEditCancel(product: ICategory) {
    const iCategory = this.localCache.get(product.id);
    if(iCategory == undefined){
      console.log("Failed to locate the category ")
      console.log(product)
      return;
    }

    this.catUpdateCancelled.emit(iCategory);
    this.localCache.delete(iCategory.id);
  }

}
