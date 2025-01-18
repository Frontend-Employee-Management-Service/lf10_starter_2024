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
    const keys = typeof array[0] === 'object' && array[0] !== null
      ? Object.keys(array[0]) : [];
    return array.filter((item: T) => {
      for (const key of keys) {
        const value = item[key as keyof T];
        if (value != null && value.toString().includes(keyword)) {
          return true;
        }
      }
      return false;
    });
  }

  filterColumnHasValue<T>(array: Array<T>, key: keyof T): Array<T> {
    if (array.length <= 0) return array;
    return array.filter((item: T) => {
      const value = item[key as keyof T];
      return value != null
    })
  }

  filterColumnHasNoValue<T>(array: Array<T>, key: keyof T): Array<T> {
    if (array.length <= 0) return array;
    return array.filter((item: T) => {
      const value = item[key as keyof T];
      return value == null
    })
  }

}
