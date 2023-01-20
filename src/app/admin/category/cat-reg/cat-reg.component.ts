import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryParams} from "../../../domain/Params/OutputDto";
import {CategoryService} from "../../../services/category.service";

@Component({
  selector: 'app-cat-reg',
  templateUrl: './cat-reg.component.html',
  styleUrls: ['./cat-reg.component.scss']
})
export class CatRegComponent implements OnInit {

  @Output() regEvent = new EventEmitter();

  public readonly fg : FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly catService: CategoryService) {
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
      },
      error: err => {
        this.regEvent.emit(false);
        console.log(err)
      },
      complete: () => {

      }
    })
  }
}
