import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class InvestmentServiceService {

  constructor(private http: HttpClient) { }

  public get401kData(): Observable<any> {
    return this.http.get('https://yq77zlm7sb.execute-api.us-east-2.amazonaws.com/prod/portfolio');
  }

  public getTotalInvestmentDetails(): Observable<any> {
    return this.http.get<any>('https://yq77zlm7sb.execute-api.us-east-2.amazonaws.com/prod/networth');
  }

  public getCurrentPrice(symbol) {
    return this.http.get('https://financialmodelingprep.com/api/v3/stock/real-time-price/' + symbol);
  }

  public getCurrentPricePromise(symbol) {
    return this.http.get('https://financialmodelingprep.com/api/v3/stock/real-time-price/' + symbol).toPromise()
    .then(res => res)
    .catch(err => {
      return Promise.reject(err.json().error || 'Server error');
    });
  }

}
