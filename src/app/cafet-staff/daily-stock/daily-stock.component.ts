import {Component, OnInit, ViewChild} from '@angular/core';
import {IDailyStock} from "../../domain/IDailyStock";
import {StockService} from "../../services/stock.service";
import {finalize} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmationService, MessageService} from "primeng/api";
import {IFood, SelectedFood} from "../../domain/IFood";
import {OverlayPanel} from "primeng/overlaypanel";

@Component({
  selector: 'app-daily-stock',
  templateUrl: './daily-stock.component.html',
  styleUrls: ['./daily-stock.component.scss']
})
export class DailyStockComponent implements OnInit {

  @ViewChild("op") overlayPanel : OverlayPanel;

  stocks : IDailyStock[];

  selectedStocks : IDailyStock[];

  newPossibleFoodItems : SelectedFood[];

  editCache = new Map<number, IDailyStock>;

  constructor(private readonly stockSer : StockService,
              private readonly spinnerService : NgxSpinnerService,
              private readonly messageService : MessageService,
              private readonly confirmationService : ConfirmationService,
  ) {
    this.selectedStocks = [];
    this.newPossibleFoodItems = [];
  }

  ngOnInit(): void {
    this.populate();
  }

  private populate(){
    this.spinnerService.show();
    this.stockSer.stockObservable$
      .pipe(
        finalize(() => {
          this.spinnerService.hide();
        })
      )
      .subscribe({
        next: value => {
          this.stocks = value;
        },
        error: err => {
          this.messageService.add({severity: "error", detail: "Failed to load current stock details", summary: "Unavailable"})
        },
        complete: () => {

        }
      })
  }

  onRowEditInit(stock: IDailyStock) {
      this.editCache.set(stock.stockId, Object.assign({}, stock));
  }

  onRowEditSave(stock: IDailyStock) {
    this.editCache.delete(stock.stockId);
  }

  onRowEditCancel(stock: IDailyStock) {
    var index = this.stocks.findIndex(s => s.stockId == stock.stockId);

    if(index < 0){
      this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to locate the food item"})
      return;
    }

    var cacheStock  = this.editCache.get(stock.stockId);

    if(cacheStock == null){
      this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to locate the food item"})
      return;
    }

    this.stocks[index] = cacheStock;
    this.editCache.delete(stock.stockId);

  }

  onDelete(stock: IDailyStock) {
    if(this.selectedStocks.length > 0){
      this.confirmationService.confirm({
        message: `You have selected multiple stock entries [${this.selectedStocks.map(s => s.foodName)}], Are you sure you want to delete all?`,
        accept: () => {
          this.deleteAll();
        }
      })
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${stock.foodName} from stock registry?`,
      accept: () => {
        this.delete(stock);
      }
    })
  }

  private deleteAll(){
    const ids : number[] = this.stocks.map(s => s.stockId);
    this.spinnerService.show();
    this.stockSer.deleteMultipleStock(ids).subscribe({
        next: value => {
          this.messageService.add({severity: "success", summary: "Deleted", detail: "The Stock has been successfully deleted"})
          this.stocks = [];
          this.spinnerService.hide();
        },
        error: err => {
          this.messageService.add({severity: "error", summary: "Failed", detail: "Failed to delete!"})
          console.log(err)
          this.spinnerService.hide();
          this.populate();
        },
        complete: () => {

        }
      })
  }

  private deleteFromTable(stock : IDailyStock){
    var index = this.stocks.findIndex(s => s.stockId == stock.stockId);
    if(index < 0)
      return;

    this.stocks.splice(index, 1);
  }

  private delete(stock: IDailyStock){
    this.spinnerService.show();
    this.stockSer.deleteStock(stock.stockId)
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe(
      {
        next: value => {
          this.messageService.add({severity: "success", summary: "Deleted", detail: "The Stock has been successfully deleted"})
          this.deleteFromTable(stock);
        },
        error: err => {
          this.messageService.add({severity: "error", summary: "Failed", detail: "Failed to delete!"})
          console.log(err)
        },
        complete: () => {

        }
      }
    )
  }

  loadNewDailyStock() {
    this.populate();
    this.loadNewPossibleFoods();
  }

  loadNewPossibleFoods(){
    this.spinnerService.show();
    this.stockSer.foodObservable$
      .pipe(
        finalize(() => {
          this.spinnerService.hide();
        })
      )
      .subscribe({next: value => {
          for (let iFood of value) {
            if(!this.isInStock(iFood.foodId))
              this.newPossibleFoodItems.push(new SelectedFood(iFood));
          }
        },
        error: err => {

        },
        complete: () => {

        }
      })
  }

  isInStock(foodId : number) : boolean {
    for (let stock of this.stocks) {
      if(stock.foodId === foodId)
        return true;
    }

    return false;
  }

  onHideOverlayPanel() {
    this.newPossibleFoodItems = [];
  }

  addNewSingleStock(product: SelectedFood) {
      this.spinnerService.show();
      this.stockSer.addNewSingleStock(product)
        .pipe(finalize(() => {
          this.spinnerService.hide();
        }))
        .subscribe({
        next: value => {
          this.populate();
          this.overlayPanel.hide();
        },
        error: err => {

        },
        complete: () => {

        }
      })
  }
}
