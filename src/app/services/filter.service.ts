import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() {
  }

  filterColumn<T>(array: Array<T>, key: keyof T, keyword: string): Array<T> {
    if (array.length <= 0) return array;
    return array.filter((item: T) => {
      const value = item[key];
      return value != null && value.toString().includes(keyword);
    })
  }

  filterAll<T>(array: Array<T>, keyword: string): Array<T> {
    if (array.length <= 0) return array;
    const keys = Object.keys(array);
    return array.filter((item: T) => {
      for (const key of keys) {
        const value = item[key as keyof T];
        if (value != null && value.toString().includes(keyword)) return true;
      }
      return false;
    });
  }

  filterColumnHasValue<T>(array: Array<T>, key: keyof T) {
    //TODO: for the radio button
  }

  filterColumnHasNoValue<T>(array: Array<T>, key: keyof T) {
    //TODO for the radio button
  }

}
