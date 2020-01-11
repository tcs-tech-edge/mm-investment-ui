import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvestmentServiceService {

  constructor(private http: HttpClient) { }

  public get401kData(): Observable<any> {

    return this.http.get('../assets/data/401k.json');
  }

  public getTotalInvestmentDetails(): Observable<any> {
    return this.http.get<any>('https://yq77zlm7sb.execute-api.us-east-2.amazonaws.com/prod/networth');
  }
}
