import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../common/state';
import { Country } from '../common/country';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Luv2ShopFormService {
  private countriesUrl = environment.apiUrl + '/countries';
  private statesUrl = environment.apiUrl + '/states';

  constructor(private httpClient: HttpClient) {}

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

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  getStates(theCountryCode: string): Observable<State[]> {
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map((response) => {
        return response._embedded.states;
      }),
    );
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
