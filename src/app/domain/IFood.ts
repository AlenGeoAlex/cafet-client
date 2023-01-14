export interface IFood {
  foodId: number;
  name: string;
  foodDescription: string;
  foodImage: string;
  foodPrice: number;
  categoryId: number;
  category: string;
}

export class SelectedFood {
  category: string;
  foodDescription: string;
  foodId: number;
  foodPrice: number;
  name: string;
  quantity : number;


  constructor(food : IFood) {
    this.category = food.category;
    this.foodDescription = food.foodDescription;
    this.foodId = food.foodId;
    this.foodPrice = food.foodPrice;
    this.name = food.name;
    this.quantity = 0;
  }
}

