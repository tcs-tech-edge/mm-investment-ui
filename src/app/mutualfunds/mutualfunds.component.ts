import { Component, OnInit } from '@angular/core';
import { InvestmentServiceService } from '../service/investment-service.service';

@Component({
  selector: 'app-mutualfunds',
  templateUrl: './mutualfunds.component.html',
  styleUrls: ['./mutualfunds.component.scss']
})
export class MutualfundsComponent implements OnInit {

  constructor(private investmentService: InvestmentServiceService) { }

  ngOnInit() {
    this.investmentService.get401kData();
     this.investmentService.get401kData().subscribe(data => {
       console.log(JSON.stringify(data));
     });

  }

}
