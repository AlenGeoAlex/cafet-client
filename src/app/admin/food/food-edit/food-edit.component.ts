import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../../services/category.service";
import {FoodService} from "../../../services/food.service";
import {MessageService} from "primeng/api";
import {AutoComplete} from "primeng/autocomplete";
import {IFood, IFoodType} from "../../../domain/IFood";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {delay} from "rxjs";

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.scss']
})
export class FoodEditComponent implements OnInit {
  public readonly fg : FormGroup;
  public pfpImage : File | null;
  public pfpLink : string;
  public filter : string[];
  public categoryMap = new Map<string, number>;
  public food : IFood;
  public readonly foodId : number;
  public readonly foodType : IFoodType[];
  constructor(private readonly fb: FormBuilder, private readonly catService : CategoryService, private readonly foodService: FoodService,private readonly messageService: MessageService, private readonly activateRoute : ActivatedRoute, private readonly router : Router, private readonly spinnerService:NgxSpinnerService) {
    this.pfpImage = null;
    this.foodType = [
      {name: "Vegetarian", code: true},
      {name: "Non-Vegetarian", code: false},
    ]
    this.filter = [];
    this.fg = fb.group(
      {
        FoodName: ['', Validators.required],
        CategoryName: ['', Validators.required],
        FoodDescription: ['', Validators.required],
        FoodImage: [null, ],
        FoodPrice: ["", Validators.required],
        FoodType: ["", Validators.required],
        FoodTags: [[]],
      }
    )

    var stringId = this.activateRoute.snapshot.paramMap.get('id');
    if(stringId == null){
      this.router.navigate(['/404/']);
      return;
    }

    this.foodId = Number.parseInt(stringId);

  }

  loadCategory() {
    this.spinnerService.show();
    this.catService.categoryObservable$.subscribe({
      next: value => {
        value.forEach(cat => {
          this.filter.push(cat.categoryName);
          this.categoryMap.set(cat.categoryName, cat.id);
        })
      },
      error: err => {
        this.filter = [];
        this.messageService.add({severity: "error", summary: "Unknown Error", detail: "Failed to load category data"})
        console.log(err);
      },
      complete: () => {
        this.spinnerService.hide();
      }
    })
  }

  ngOnInit(): void {
    this.loadFood();
    this.loadCategory();
  }

  loadFood(){
    this.spinnerService.show();
    this.foodService.getFood(this.foodId).subscribe({
      next: value => {
        this.food = value;
        console.log(value)
        this.fg.setValue({
          FoodName: this.food.name,
          CategoryName: this.food.category,
          FoodDescription: this.food.foodDescription,
          FoodImage: null,
          FoodPrice: this.food.foodPrice,
          FoodType: `${this.food.vegetarian}`,
          FoodTags: this.food.tags,
        })
        this.pfpLink = this.food.foodImage;
      },
      error: err => {
        this.router.navigate(['/404/']);
      },
      complete: () => {
        this.spinnerService.hide();
      }
    })
  }

  onImageSelect($event : any) {
    if($event.currentFiles.length == 0)
      return;

    this.pfpImage = <File> $event.currentFiles[0];
    this.fg.patchValue({
      FoodImage: this.pfpImage
    })
    var reader = new FileReader();
    reader.readAsDataURL(this.pfpImage);
    reader.onload = (event) => {
      if(event.target == null)
        return;

      const result = event.target.result;
      if(typeof result === "string"){
        this.pfpLink = result;
      }
    }
  }

  filterCategory($event: any) {
    let filtered : any[] = [];
    let query = $event.query;

    for (let key of this.categoryMap.keys()) {
      if(key.includes(query))
        filtered.push(key)
    }

    this.filter = filtered;
  }

  private contains(key: string): boolean {
    let cont = false;

    for (let catName of this.categoryMap.keys()) {
      if(catName === key)
        return true;
    }

    return cont;
  }

  selectCategory(value : AutoComplete) {
    if(!this.contains(value.value))
    {
      value.writeValue("");
      this.messageService.add({severity: "error", summary: "Unknown Error", detail: "You should select a valid food category"})
    }
  }

  isValid() {
    if(this.fg.invalid)
      return true;

    let cName = this.fg.get("CategoryName")?.value;

    if(!this.contains(cName)){
      return true;
    }

    return false;
  }

  cancel() {
    this.router.navigate(["/admin/food"])
  }

  parseFoodTag(ar : string[]) : string {
    let str = "";

    for (let i = 0; i < ar.length; i++) {
      if(i == 0)
        str = ar[i];
      else{
        str = str + ","+ar[i];
      }
    }

    return str;
  }

  submit() {
    var number = this.categoryMap.get(this.fg.get("CategoryName")?.value);

    if(number === null || number === undefined)
    {
      //TODO SET Failed
      return;
    }

    const data = new FormData();
    data.append("FoodName", this.fg.get("FoodName")?.value);
    data.append("CategoryName", this.fg.get("CategoryName")?.value);
    data.append("CategoryId", number.toString())
    data.append("FoodDescription", this.fg.get("FoodDescription")?.value);
    data.append("FoodPrice", this.fg.get("FoodPrice")?.value);
    data.append("FoodImage", this.fg.get("FoodImage")?.value);
    data.append("FoodId", this.foodId.toString());
    data.append("FoodType", this.fg.get("FoodType")?.value);
    data.append("Tags", this.parseFoodTag(this.fg.get("FoodTags")?.value));

    this.foodService.updateFood(data).subscribe({
      next: value => {
        this.messageService.add({severity: "success", summary: "Success", detail: "Successfully updated"})
        this.loadFood();
        this.loadCategory();
      },
      error: err => {
        this.messageService.add({severity: "error", summary: "Error", detail: "Failed to update"})
      },
      complete: () => {
        this.fg.reset();
      }
    })
  }


}
