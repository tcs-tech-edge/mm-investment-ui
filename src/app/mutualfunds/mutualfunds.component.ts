import { Component, OnInit } from '@angular/core';
import { InvestmentServiceService } from '../service/investment-service.service';
import { InvestmentModel } from '../model/model401k';

@Component({
  selector: 'app-mutualfunds',
  templateUrl: './mutualfunds.component.html',
  styleUrls: ['./mutualfunds.component.scss']
})

export class MutualfundsComponent implements OnInit {

  view: any[] = [500, 300];
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
  pieData: any[] = new Array();
  doughnut = false;
  showLabels = false

  tabledata401kHeader: String[] = new Array();
  tabledata401kData: any[] = new Array();
  colorScheme;



  investmentModelArray: InvestmentModel[];
  // colorScheme = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };
  constructor(private investmentService: InvestmentServiceService) {

    // Header for the table
    this.tabledata401kHeader.push('Fund Name');
    this.tabledata401kHeader.push('Number of Shares');
    this.tabledata401kHeader.push('Avg Purchase Price');
    this.tabledata401kHeader.push('Current Unit Price');
    this.tabledata401kHeader.push('Current Value');
    this.tabledata401kHeader.push('Margin');
    this.investmentService.get401kData().subscribe(data => {
      this.investmentModelArray = data;
      const datasize = this.investmentModelArray.length;

      const domain: any = new Array();



      let i = 0;
      this.investmentModelArray.forEach((model, index) => {
        domain.push(this.getRandomColor());
        this.investmentService.getCurrentPrice(model.ticker).subscribe(priceData => {
          const purchasePrice: any = (model.purchase_price * model.number_of_shares).toFixed(2);
          const currentPrice: any = (priceData['price'] * model.number_of_shares).toFixed(2);
          const margin = ((currentPrice - purchasePrice) * 100 / purchasePrice).toFixed(2)
          this.tabledata401kData.push({
            'Fund_Name': model.ticker,
            'Shares': model.number_of_shares,
            'AvgPrice': purchasePrice,
            'StockPrice': priceData['price'],
            'CurVal': currentPrice,
            'Margin': margin
          })
          const pieChartItem = { 'name': model.ticker, 'value': currentPrice }
          this.pieData.push(pieChartItem);
          i = i + 1;
          if (i === datasize) {
            this.data401k = this.pieData;
            this.colorScheme = { 'domain': domain };

          }
        });
      });
    });
  }
  ngOnInit() {


  }

  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }


}
