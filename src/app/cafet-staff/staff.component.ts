import {Component, ElementRef, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {CafetService} from "./services/cafet.service";
import {IEmailQuery} from "../domain/IEmailQuery";
import {IDailyStock} from "../domain/IDailyStock";
import {MessageService} from "primeng/api";
import {StaffOrder} from "../domain/StaffOrder";
import {AutoComplete} from "primeng/autocomplete";
import {OverlayPanel} from "primeng/overlaypanel";
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from "rxjs";
import {StaffFoodOrder} from "../domain/StaffFoodOrder";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  public static regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  public newRegistration : boolean;
  autoComplete : AutoComplete;
  @ViewChild("autoComplete") set content(ac : AutoComplete) {
    this.autoComplete = ac;
    setTimeout(() => {
      if(ac == null || this.currentlySelectedAccounts == null)
        return;

      ac.writeValue(this.currentlySelectedAccounts)
    }, 1000)
  }

  @ViewChild("firstName") firstName : ElementRef;
  @ViewChild("lastName") lastName : ElementRef;
  @ViewChild("textBox") emailTextBox : ElementRef;
  @ViewChild("foodSearch") foodSearch : AutoComplete;

  public currentlySelectedAccounts : IEmailQuery | null;
  public emailQuerySuggestion : IEmailQuery[]

  public foodSuggestion : IDailyStock[];
  public selectedFoods : StaffOrder[];

  public emailQueryCoolDown : Date;
  public foodQueryCoolDown : Date;

  displayResponsive: boolean;

  constructor(private readonly cafetService : CafetService,private readonly router : Router,private readonly messageService : MessageService, private readonly spinnerService : NgxSpinnerService) {
    this.newRegistration = false;
    this.currentlySelectedAccounts = null;
    this.emailQuerySuggestion = [];
    this.foodSuggestion = [];
    this.selectedFoods = []
    this.emailQueryCoolDown = new Date();
    this.foodQueryCoolDown = new Date();
    this.displayResponsive = false
  }

  ngOnInit(): void {
  }

  searchUser($event : any){
    if($event.query == null || $event.query.length <= 3)
      return;
    const date = new Date();
    if((date.getTime() - this.emailQueryCoolDown.getTime() <= 1000))
      return;

    this.emailQueryCoolDown = new Date();
    this.getUserSuggestion($event);
  }

  searchFood($event : any){
    if($event.query == null || $event.query.length <= 2)
      return;

    const date = new Date();
    if((date.getTime() - this.foodQueryCoolDown.getTime() <= 1000))
      return;

    this.foodQueryCoolDown = new Date();
    this.getFoodInStockSuggestion($event);
  }

  getUserSuggestion($event : any){
    this.cafetService.searchUser($event.query).subscribe(
      {next: value => {
          this.emailQuerySuggestion = value;
        }
      }
    )
  }

  getFoodInStockSuggestion($event: any){
    const searchQuery = $event.query;
    this.cafetService.searchStockFood(searchQuery).subscribe({
      next: value => {
        this.foodSuggestion = value;
      }
    })
  }


  onAccountSelected(emailAddress: string) {
    var index = this.emailQuerySuggestion.findIndex(email => email.emailAddress == emailAddress);

    if(index <= -1){
      this.currentlySelectedAccounts = null;
      return;
    }

    this.currentlySelectedAccounts = this.emailQuerySuggestion[index];
  }

  onAccountUnselcted(){
    this.currentlySelectedAccounts = null;

  }

  onFoodSelect($event: IDailyStock) {
    this.cafetService.getStockOfFood($event.foodId).subscribe({
      next: value => {
        this.handleNewStaffOrder(value);
      },
      error: err => {
        this.messageService.add({severity: "error", detail: `${$event.foodName} is no more available on stock!`, summary: "Invalid"})
      },
      complete: () => {

      }
    })
  }

  handleNewStaffOrder(updateStock : IDailyStock){
    if(updateStock.currentInStock <= 0){
      this.messageService.add({severity: "error", detail: `${updateStock.foodName} is no more available on stock!`, summary: "Invalid"})
      this.removeFromSelectedFood(updateStock.foodId);
      return
    }

    var index = this.selectedFoods.findIndex(ord => ord.foodId == updateStock.foodId);
    if(index <= -1){
      const newOrder = new StaffOrder(updateStock);
      this.selectedFoods.push(newOrder);
    }else{
      const updatedStockItem = this.selectedFoods[index];
      const newQuantity = updatedStockItem.orderQuantity + 1;
      if(updateStock.currentInStock < newQuantity){
        this.messageService.add({severity: "error", detail: `${updateStock.foodName} is no more available on stock!`, summary: "Invalid"})
        return
      }

      const updatedOrder = new StaffOrder(updateStock);
      updatedOrder.orderQuantity = newQuantity;
      this.selectedFoods[index] = updatedOrder;
      this.messageService.add({severity: "success", detail: `${updateStock.foodName} is updated with new quantity!`, summary: "Updated"})
    }
  }

  toggleRegistration(state : boolean){
    this.newRegistration = state;
    this.currentlySelectedAccounts = null;
    if(this.firstName != null){
      this.firstName.nativeElement.value = null;
    }

    if(this.lastName != null) {
      this.lastName.nativeElement.value = null;
    }

    if(this.emailTextBox != null){
      this.emailTextBox.nativeElement.value = null;
    }
  }

  onQuantityUpdate(selectedFood: StaffOrder) {
    if(selectedFood.orderQuantity <= 0){
      this.removeFromSelectedFood(selectedFood.foodId);
      return;
    }

    this.cafetService.getStockOfFood(selectedFood.foodId).subscribe({
      next: updateStock => {
        if(updateStock.currentInStock <= 0){
          this.messageService.add({severity: "error", detail: `${updateStock.foodName} is no more available on stock!`, summary: "Invalid"})
          this.removeFromSelectedFood(updateStock.foodId);
          return
        }

        var index = this.selectedFoods.findIndex(ord => ord.foodId == updateStock.foodId);
        if(index <= -1){
          const newOrder = new StaffOrder(updateStock);
          this.selectedFoods.push(newOrder);
        }else{
          const updatedStockItem = this.selectedFoods[index];
          if(updateStock.currentInStock < updatedStockItem.orderQuantity){
            this.messageService.add({severity: "error", detail: `${selectedFood.foodName} is no more available on stock!`, summary: "Invalid"})
            this.removeFromSelectedFood(selectedFood.foodId);
            return
          }

          const updatedOrder = new StaffOrder(updateStock);
          updatedOrder.orderQuantity = updatedStockItem.orderQuantity;
          this.selectedFoods[index] = updatedOrder;
          this.messageService.add({severity: "success", detail: `${updateStock.foodName} is updated with new quantity!`, summary: "Updated"})
        }
      },
      error: err => {
        this.messageService.add({severity: "error", detail: `${selectedFood.foodName} is no more available on stock!`, summary: "Invalid"})
        this.removeFromSelectedFood(selectedFood.foodId);
      },
      complete: () => {

      }
    })
  }

  removeFromSelectedFood(foodId : number){
    var index = this.selectedFoods.findIndex(sF => sF.foodId == foodId);

    if(index <= -1)
      return

    this.selectedFoods.splice(index, 1);
  }

  cancelOrder() {
    if(this.firstName != null){
      this.firstName.nativeElement.value = null;
    }

    if(this.lastName != null) {
      this.lastName.nativeElement.value = null;
    }

    if(this.emailTextBox != null){
      this.emailTextBox.nativeElement.value = null;
    }
    this.currentlySelectedAccounts = null;
    this.emailQuerySuggestion = [];
    this.foodSuggestion = [];
    this.selectedFoods = []
    this.emailQueryCoolDown = new Date();
    this.foodQueryCoolDown = new Date();
    if(this.autoComplete != null)
      this.autoComplete.writeValue("");

    if(this.foodSearch != null)
      this.foodSearch.writeValue(null);
  }

  finalizeOrder() {

    if(!this.canPlaceOrder())
      return;

    this.displayResponsive = true;
  }

  placeOrder(walletPay : boolean) {
    this.displayResponsive = false;
    if(!this.canPlaceOrder()){
      this.messageService.add({severity: "error", detail: "Failed to validate the data! Try again..", summary: "Failed"})
      return;
    }

    if(this.currentlySelectedAccounts == null || this.selectedFoods == null){
      return;
    }

    var staffFoodOrder = new StaffFoodOrder(this.currentlySelectedAccounts, this.selectedFoods, walletPay);

    console.log(staffFoodOrder);
    this.spinnerService.show();
    this.cafetService.order(staffFoodOrder)
      .pipe(finalize(() => {
        this.spinnerService.hide();
        this.displayResponsive = false;
      }))
      .subscribe({
      next: value => {
        this.messageService.add({severity: "success", detail: "The order has been placed", summary: "Order Placed"})
        this.messageService.add({severity: "success", detail: `${value.orderId}`, summary: "Order Id"})
        this.cancelOrder();


      },
      error: err => {
        if(err instanceof HttpErrorResponse){
          if(err.error){
            if(err.status == 400){
              this.messageService.add({severity: "error", detail: `${err.error}`, summary: "Failed"})
            }else{
              this.messageService.add({severity: "error", detail: `An unknown error occurred`, summary: "Failed"})
              console.log(err)
            }
          }
        }
      },
      complete: () => {

      }
    });
  }


  canPlaceOrder() : boolean {
    return this.selectedFoods.length > 0 &&
      (this.isSelectedAccountValid());
  }

  private isSelectedAccountValid() : boolean {
    if(this.currentlySelectedAccounts == null)
      return false;


    if(this.currentlySelectedAccounts.emailAddress == null || this.currentlySelectedAccounts.emailAddress.length <=0 )
      return false;

    if(this.currentlySelectedAccounts.firstName == null || this.currentlySelectedAccounts.firstName.length <=0 )
      return false;

    if(this.currentlySelectedAccounts.lastName == null || this.currentlySelectedAccounts.lastName.length <=0 )
      return false;

    return true;
  }

  onBlur(textBox: HTMLInputElement) {
    if(textBox.value == null)
      return;

    if(!StaffComponent.regexExp.test(textBox.value)){
      textBox.value = "";
      this.messageService.add({summary: "Invalid Email", detail: "You should provide a valid email address", severity: "error"})
      return;
    }

    this.cafetService.getUserOfEmailAddress(textBox.value).subscribe({next: value =>  {
      if(value == null){
        if(this.currentlySelectedAccounts == null) {
          this.currentlySelectedAccounts = {
            emailAddress: textBox.value,
            firstName: "",
            lastName: '',
            wallet: 0,
          }
        }else{
          this.currentlySelectedAccounts.emailAddress = textBox.value;
        }
        return;
      }

        this.currentlySelectedAccounts = {
          emailAddress: textBox.value,
          firstName: value.firstName,
          lastName: value.lastName,
          wallet: value.wallet
        }
        this.newRegistration = false;
        this.autoComplete.writeValue(this.currentlySelectedAccounts)

      },
      complete: () => {

      },
      error: err => {
        if(this.currentlySelectedAccounts == null) {
          this.currentlySelectedAccounts = {
            emailAddress: textBox.value,
            firstName: "",
            lastName: '',
            wallet: 0,
          }
        }else{
          this.currentlySelectedAccounts.emailAddress = textBox.value;
        }
      }
    })
  }


  inputFirstName() {
    if(this.firstName == null)
      return;

    if(this.currentlySelectedAccounts == null) {
      this.currentlySelectedAccounts = {
        emailAddress: "",
        firstName: this.firstName.nativeElement.value,
        lastName: '',
        wallet: 0,
      }
    }else{
        this.currentlySelectedAccounts.firstName = this.firstName.nativeElement.value;
      }
  }


  inputSecondName() {
    if(this.lastName == null)
      return;

    if(this.currentlySelectedAccounts == null) {
      this.currentlySelectedAccounts = {
        emailAddress: "",
        lastName: this.lastName.nativeElement.value,
        firstName: '',
        wallet: 0,
      }
    }else{
      this.currentlySelectedAccounts.lastName = this.lastName.nativeElement.value;
    }
  }

  getPossibleCostOfOrder() : number {
    let cost = 0.0;

    for (let selectedFood of this.selectedFoods) {
      const price = selectedFood.foodPrice;
      const quantity = selectedFood.orderQuantity;

      const foodCost = price * quantity;
      cost += foodCost;
    }

    return cost;
  }
}
