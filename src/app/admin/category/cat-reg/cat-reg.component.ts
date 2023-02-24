import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryParams} from "../../../domain/Params/OutputDto";
import {CategoryService} from "../../../services/category.service";
import {MessageService} from "primeng/api";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-cat-reg',
  templateUrl: './cat-reg.component.html',
  styleUrls: ['./cat-reg.component.scss']
})
export class CatRegComponent implements OnInit {

  @Output() regEvent = new EventEmitter();

  public readonly fg : FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly messageService : MessageService, private readonly catService: CategoryService) {
    this.fg = fb.group(
      {
        CategoryName: ['', Validators.required],
        CategoryDescription: ['', Validators.required],
      }
    )
  }

  ngOnInit(): void {
  }

  submitForm(inp: CategoryParams) {
    this.catService.createNewCategory(inp).subscribe({
      next: value => {
        this.regEvent.emit(true);
        this.fg.reset();
        this.messageService.add({severity: "success", summary: "Registered", detail: "The category is registered!"})
      },
      error: err => {
        this.regEvent.emit(false);
        if(err instanceof HttpErrorResponse){
          if(err.status === 406 || err.status === 422){
            this.messageService.add({severity: "error", summary: `${err.error.message}`, detail: `${err.error.details}`})
          }
        }else{
          this.messageService.add({severity: "error", summary: "Failed", detail: "Failed to register the category!"})
        }
        console.log(err)
      },
      complete: () => {

      }
    })
  }
}
