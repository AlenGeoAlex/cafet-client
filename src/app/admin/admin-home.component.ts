import {Component, OnDestroy, OnInit} from '@angular/core';
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import Endpoints from "../constants/Endpoints";
import {MessageService} from "primeng/api";
import {NgxSpinnerService} from "ngx-spinner";
import DefaultStatistics, {IStatistics} from "../domain/IStatistics";
import {IStaffOrderView, OrderedFood} from "../domain/IStaffOrderView";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit, OnDestroy{

  private readonly statsWebsocket : HubConnection;
  private readonly orderWebsocket : HubConnection;

  public stats : IStatistics = DefaultStatistics();
  public liveOrders : IStaffOrderView[] = [];
  constructor(private readonly messageService : MessageService, private readonly spinnerService : NgxSpinnerService) {


    this.statsWebsocket = new HubConnectionBuilder()
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .withUrl(Endpoints.Live+"stats")
      .build();

    this.orderWebsocket = new HubConnectionBuilder()
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .withUrl(Endpoints.Live+"order")
      .build();
  }

  ngOnInit(): void {
    this.statsWebsocket.start()
      .then((val) => {
        this.statsWebsocket.invoke('FetchStats');
      })
      .catch((err) => {
        console.log(err)
        this.messageService.add({severity: "error", summary: "Unable to connect", detail: "Failed to connect to the live websocket!"})
      })

    this.statsWebsocket.on('OnStatisticsUpdate', (val : IStatistics) => {
      console.log(val);
      this.stats = val;
    })

    this.orderWebsocket.start()
      .then(val => {
        this.orderWebsocket.invoke('GetLiveOrders');
      });

    this.orderWebsocket.on('SendOrderUpdate', (res) => {
      this.liveOrders.unshift(res);
    })
    this.orderWebsocket.on('FetchOrderList', (res) => {
      this.liveOrders = res;
    });

    this.orderWebsocket.on('OrderCancelled', (res) => {
      try {

        var findIndex = this.liveOrders.findIndex(s => s.orderId === res);

        if(findIndex >= 0)
          this.liveOrders[findIndex].isCancelled = true;
      }catch (err){
        console.log(err)
      }
    });

    this.orderWebsocket.on('OrderCompleted', (res) => {
      try {
        var findIndex = this.liveOrders.findIndex(s => s.orderId === res);

        if(findIndex >= 0)
          this.liveOrders[findIndex].isCompleted = true;
      }catch (err){
        console.log(err)
      }
    });
  }

  ngOnDestroy(): void {
    this.statsWebsocket.stop();
    this.orderWebsocket.stop();
  }

  getOrderAmount(of : OrderedFood[]) : number {
    let cost = 0;

    for (let orderedFood of of) {
      cost += orderedFood.foodQuantity * orderedFood.foodPrice;
    }

    return cost;
  }

  getOrderStatus(s : IStaffOrderView) : string {
    if(s.isCompleted)
      return "Completed";

    if(s.isCancelled)
      return "Cancelled";

    return "Awaiting Delivery";
  }

  getOrderStatusClass(s : IStaffOrderView) : string {
    if(s.isCompleted)
      return "text-success";

    if(s.isCancelled)
      return "text-danger";

    return "text-secondary";
  }

}
