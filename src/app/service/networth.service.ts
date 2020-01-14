import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { NetWorth } from 'app/model/modelNetWorth';

@Injectable({
  providedIn: 'root'
})
export class NetworthService {

  constructor(private _http: HttpClient) { }

  getNetworth(): Observable<NetWorth[]> {
    return this._http.get<NetWorth[]>('https://yq77zlm7sb.execute-api.us-east-2.amazonaws.com/prod/networth');
    //return this._http.get<NetWorth[]>('../../assets/data/networth.json');
  }
}
