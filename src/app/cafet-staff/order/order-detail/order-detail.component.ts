import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CafetService} from "../../../services/cafet.service";
import {IStaffOrderView, OrderedFood} from "../../../domain/IStaffOrderView";
import {HttpParams} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "primeng/api";
import {finalize} from "rxjs";
import {HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import Endpoints from "../../../constants/Endpoints";
import {AutoComplete} from "primeng/autocomplete";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {

  @ViewChild("autoComplete") autoCompletePane : AutoComplete;

  public searchCooldown : Date;

  public suggestions : IStaffOrderView[];
  public selectedOrder : IStaffOrderView | null;

  public ignoreCancelled : boolean = false;
  public ignoreComplete : boolean = false;
  private hubConnectionBuilder: HubConnection;

  public liveOrders : IStaffOrderView[];

  constructor(
    private readonly cafetService : CafetService,
    private readonly spinnerService : NgxSpinnerService,
    private readonly messageService : MessageService,
  ) {
    this.suggestions = []
    this.selectedOrder = null;
    this.searchCooldown = new Date();
    this.liveOrders = [];
  }



  ngOnInit(): void {
    this.hubConnectionBuilder = new HubConnectionBuilder()
      .withUrl(Endpoints.LiveStaff+"order/", {skipNegotiation: true, transport: HttpTransportType.WebSockets})
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnectionBuilder.start()
      .then(() => {
        console.log("Connection Established");
        this.hubConnectionBuilder.invoke("GetRecentOrders")
      })
      .catch((err) => {
        console.log(err);
      });

    this.hubConnectionBuilder.on('SendOrderUpdate', (res) => {
      try {
        this.liveOrders.push(res);
      }catch (err){
        console.log(err)
      }
    });

    this.hubConnectionBuilder.on('FetchOrderList', (res) => {
      this.liveOrders = res;
    });

    this.hubConnectionBuilder.on('OrderCancelled', (res) => {
      try {

        var findIndex = this.liveOrders.findIndex(s => s.orderId === res);

        if(findIndex >= 0)
          this.liveOrders.splice(findIndex, 1);
      }catch (err){
        console.log(err)
      }
    });

    this.hubConnectionBuilder.on('OrderCompleted', (res) => {
      try {
        var findIndex = this.liveOrders.findIndex(s => s.orderId === res);

        if(findIndex >= 0)
          this.liveOrders.splice(findIndex, 1);
      }catch (err){
        console.log(err)
      }
    });
  }

  onSearchEvent($event: any) {
    const query = $event.query;
    if(query.length < 3)
      return;


    let params : HttpParams = new HttpParams();
    params = params.append("searchParam", query);
    params = params.append("ignoreCancelled", this.ignoreCancelled);
    params = params.append("ignoreCompleted", this.ignoreComplete);

    this.cafetService.searchOrder(params)
      .subscribe({
        next: value => {
          this.suggestions = value;

        },
        error: err => {

        },
        complete: () => {

        }
      })
  }

  onSelect($event : IStaffOrderView){
    this.selectedOrder = $event;
  }

  onUnselect() {
    this.selectedOrder = null;
  }

  markTheOrderRejected() {
    if(this.selectedOrder == null){
      return;
    }
    this.spinnerService.show();
    this.cafetService.reject(this.selectedOrder.orderId)
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
        next: value => {
          if(value){
            this.messageService.add({severity: "success", summary: "Failed!", detail: "The order is rejected"})
            this.selectedOrder = null;
          }
        },
        error: err => {


        }
      })
  }

  markTheOrderComplete() {
    if(this.selectedOrder == null){
      return;
    }
    this.spinnerService.show();
    this.cafetService.accept(this.selectedOrder.orderId)
      .pipe(finalize(() => {
        this.spinnerService.hide();
      }))
      .subscribe({
        next: value => {
          if(value){
            this.messageService.add({severity: "success", detail: "The order is completed!", summary: "Complete"})
            this.selectedOrder = null;

          }
        },
        error: err => {


        }
      })
  }

  ngOnDestroy(): void {
    this.hubConnectionBuilder.stop().then(() => {
      console.log("Successfully closed the websocket")
    })
  }

  getTotalPrice(of : OrderedFood[]) : number {
    let cost = 0;

    for (let orderedFood of of) {
      cost += orderedFood.foodQuantity * orderedFood.foodPrice;
    }

    return cost;
  }

  onClickOnCard(order: IStaffOrderView) {
    if(this.selectedOrder == null){
      this.selectedOrder = order;
      return;
    }

    if(this.selectedOrder.orderId === order.orderId){
      this.selectedOrder = null;
    }else{
      this.selectedOrder = order;
    }
  }
}
