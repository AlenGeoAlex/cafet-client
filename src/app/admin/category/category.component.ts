import { Component, OnInit } from '@angular/core';
import {ICategory} from "../../domain/ICategory";
import {CategoryService} from "../../services/category.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  category: ICategory[];


  constructor(private readonly catService: CategoryService, private readonly messageService: MessageService) {
    this.loadCategory()
  }

  ngOnInit(): void {

  }

  onRegistrationEvent($event: any){
    if($event){
      this.messageService.add({severity: "success", summary: "Success", detail: "Registered a new category"})
      this.loadCategory()
    }else{
      this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to register the new category"})
    }
  }

  onDeleteEvent($event: any){
    if($event){
      this.messageService.add({severity: "success", summary: "Success", detail: "Successfully deleted"})
      this.loadCategory()
    }else{
      this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to delete the category"})
    }
  }

  onCatUpdate($event : ICategory | null){
    if($event == null){
      this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to update the category"})
    }else{
      this.messageService.add({severity: "success", summary: "Success", detail: "Successfully updated"})
    }
  }

  loadCategory(){
    this.catService.categoryObservable$.subscribe({
      next: value => {
        this.category = value;
      },
      error: err => {
        this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to load category data"})
        console.log(err)
      },
      complete: () => {

      }
    });
  }

  onCatUpdateCancelled($event: ICategory) {
    let counter = 0;
    let findIndex = -1;
    this.category.forEach(cat => {
      if(cat.id === $event.id){
        findIndex = counter;
      }
      counter++;
    })

    if(findIndex >= 0){
      this.category[findIndex] = $event;
    }
  }
}
