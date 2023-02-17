import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrandData } from '../models/brand-data';

const URL = 'http://localhost:3500/get_brand_data';

@Injectable({
  providedIn: 'root'
})
export class FetchBrandDataService {
  constructor(private http: HttpClient) { }

  public getBrandData(start: number, end: number, timezone: string): Observable<BrandData[]> {
    return this.http.post<BrandData[]>(
      URL,
      {
        "date": {
          "start": start,
          "end": end,
          "timezone": timezone
        }
      }
    );
  }
}
