import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../category/category.service";
import {MessageService} from "primeng/api";
import {AutoComplete} from "primeng/autocomplete";
import {FoodService} from "../food.service";

@Component({
  selector: 'app-food-reg',
  templateUrl: './food-reg.component.html',
  styleUrls: ['./food-reg.component.scss']
})
export class FoodRegComponent implements OnInit {


  @Output() regEvent = new EventEmitter();

  public readonly fg : FormGroup;
  public pfpImage : File | null;
  public filter : string[];
  public categoryMap = new Map<string, number>;

  constructor(private readonly fb: FormBuilder, private readonly catService : CategoryService, private readonly foodService: FoodService,private readonly messageService: MessageService) {
    this.pfpImage = null;
    this.filter = [];
    this.fg = fb.group(
      {
        FoodName: ['', Validators.required],
        CategoryName: ['', Validators.required],
        FoodDescription: ['', Validators.required],
        FoodImage: [null, ],
        FoodPrice: ["", Validators.required]
      }
    )

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
  }


  ngOnInit(): void {
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

  submit() {
    if(this.pfpImage == null)
      return;

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
    data.append("FoodImage", this.fg.get("FoodImage")?.value)
    this.foodService.createNewFood(data).subscribe({
      next: value => {
        this.regEvent.emit(true);
        this.fg.reset();
      },
      error: err => {
        this.regEvent.emit(true);
        this.fg.reset();
      },
      complete: () => {
        this.fg.reset();
      }
    })
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
}
