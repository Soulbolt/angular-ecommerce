import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Luv2ShopFormService {
  constructor() {}

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // Build an array for "Month" dropdown list
    // - start at current month at 1 and loop until 12
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    // Build an array for "Year" drop down list
    // - start at current year and loop for next 10 years;
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}