import {environment} from "../../environments/environment";

const Endpoints = {
  Search : environment.apiUrl+"search/",
  Stock : environment.apiUrl+"stock/",
  Order : environment.apiUrl+"order/",
  User : environment.apiUrl+"users/",
  Auth : environment.apiUrl+"auth/",
  Cart : environment.apiUrl+"cart/",
}

export default Endpoints;
