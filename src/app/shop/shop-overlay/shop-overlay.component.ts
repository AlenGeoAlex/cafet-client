import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-shop-overlay',
  templateUrl: './shop-overlay.component.html',
  styleUrls: ['./shop-overlay.component.scss']
})
export class ShopOverlayComponent implements OnInit {

  @Output() onSearch = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  searchEvent(inputElement: HTMLInputElement) {
    const searchElement = inputElement.value;

    if(searchElement.length <= 0)
    {
      this.onSearch.emit(null);
      return;
    }

    if(searchElement.length <= 3)
      return

    this.onSearch.emit(searchElement);
  }
}
