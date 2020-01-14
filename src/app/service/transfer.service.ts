import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private totalAccountValueSource = new Subject<number>();

  totalAccountValue = this.totalAccountValueSource.asObservable();

  constructor() { }

  pushTotalValue(value: number){
    console.log('Recieved value ****************'+value);
    this.totalAccountValueSource.next(value);
  }
}
