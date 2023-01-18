import {environment} from "../../environments/environment";

const Endpoints = {
  Search : environment.apiUrl+"search/",
  Stock : environment.apiUrl+"stock/",
  Order : environment.apiUrl+"order/",
  User : environment.apiUrl+"users/"
}

export default Endpoints;