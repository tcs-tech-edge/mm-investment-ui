import { Component, OnInit } from '@angular/core';
import { InvestmentServiceService } from '../service/investment-service.service';
import { InvestmentModel } from '../model/model401k';

@Component({
  selector: 'app-mutualfunds',
  templateUrl: './mutualfunds.component.html',
  styleUrls: ['./mutualfunds.component.scss']
})

export class MutualfundsComponent implements OnInit {

  view: any[] = [700, 400];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Number';
  showYAxisLabel = true;
  yAxisLabel = 'Color Value';
  timeline = true;
  data401k: any[] = new Array();
  investmentModelArray: InvestmentModel[];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  constructor(private investmentService: InvestmentServiceService) {
    const pieData: any[] = new Array();
    this.investmentService.get401kData();
    this.investmentService.get401kData().subscribe(data => {
      this.investmentModelArray = data;
      this.investmentModelArray.forEach(model => {
        const totalAmt = model.number_of_shares * model.purchase_price;
        const pieChartItem = { 'name': model.accountName, 'value': totalAmt }
        pieData.push(pieChartItem);
        this.data401k = pieData;
      });
    });
  }
  ngOnInit() {


  }

}
