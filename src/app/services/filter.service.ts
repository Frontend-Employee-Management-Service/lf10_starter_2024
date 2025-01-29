import {Injectable} from '@angular/core';
import {Qualification} from "../models/Qualification";
import {Employee} from "../models/Employee";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() {
  }

  filterColumn<T>(array: Array<T>, key: keyof T, keyword: string): Array<T> {
    return array.filter((item: T) => {
      const value = item[key];
      return value != null && value.toString().toLowerCase().includes(keyword.toLowerCase());
    })
  }

  filterAll<T>(array: Array<T>, keyword: string): Array<T> {
    const keys = typeof array[0] === 'object' && array[0] !== null
      ? Object.keys(array[0]) : [];
    return array.filter((item: T) => {
      for (const key of keys) {
        const value = item[key as keyof T];
        if (value != null && value.toString().toLowerCase().includes(keyword.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
  }

}
