import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private totalAccountValueSource = new Subject<number>();
  private total401KValueSource = new Subject<number>();
  private total529ValueSource = new Subject<number>();
  private totalIRAValueSource = new Subject<number>();

  totalAccountValue = this.totalAccountValueSource.asObservable();
  total401KValue = this.total401KValueSource.asObservable();
  total529Value = this.total529ValueSource.asObservable();
  totalIRAValue = this.totalIRAValueSource.asObservable();

  constructor() { }

  pushTotalValue(value: number){
    console.log('Recieved value ****************'+value);
    this.totalAccountValueSource.next(value);
  }

  pushAccountTotalValues(_401k:number, _529:number, IRA:number){
    console.log('Got account values'+_401k);
    this.totalIRAValueSource.next(IRA);
    this.total529ValueSource.next(_529);
    this.total401KValueSource.next(_401k);
  }

}
