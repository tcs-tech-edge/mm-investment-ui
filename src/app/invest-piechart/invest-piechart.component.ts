import { Component, OnInit } from '@angular/core';
import { InvestmentServiceService } from '../service/investment-service.service';
import { TransferService } from '../service/transfer.service';
import { Customer } from '../model/customer';




@Component({
  selector: 'app-invest-piechart',
  templateUrl: './invest-piechart.component.html',
  styleUrls: ['./invest-piechart.component.scss']
})
export class InvestPiechartComponent implements OnInit {
  view: any[] = [600, 200];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Number';
  showYAxisLabel = true;
  doughnut = false;
  explodeSlices = false;
  yAxisLabel = 'Color Value';
  timeline = true;
  colorScheme = {
    domain: ['black', 'blue', 'red']
  };
  showLabels = false;
  legendPosition = 'right';

  investedAmount: Customer[];
  dataPie: any[] = new Array();
  _401kNetWorth: number = 0;
  iraWorth: number = 0;
  _529Worth: number = 0;
  totalNetworth: number = 0;

  tableData: Customer[];
  constructor(private investmentService: InvestmentServiceService, private transferService: TransferService) {
    this.getCurrentDataSet();
  }

  getCurrentDataSet() {

    let _401KTotal = 0;
    let _529Total = 0;
    let IRATotal = 0;
    this.investmentService.get401kData().subscribe(data => {
      const promises = [];
      data.forEach((model, index) => {
        promises.push(
          this.investmentService.getCurrentPricePromise(model.ticker).then(priceData => {
             const currentPrice: any = parseFloat((priceData['price'] * model.number_of_shares).toFixed(2));
            switch (model.investment_type) {
              case '_529': {
                _529Total = _529Total + currentPrice;
                break;
              }
              case '_401K': {
                _401KTotal = _401KTotal + currentPrice;
                break;
              }
              case 'Roth_IRA': {
                IRATotal = IRATotal + currentPrice;
                break;
              }
            }
          })
        );
      });

      Promise.all(promises).then(() => {
        const pieData: any[] = new Array();
        const pieChartItem401 = { 'name': '401 K', 'value': parseFloat((_401KTotal).toFixed(2))}
        pieData.push(pieChartItem401);
        this.dataPie = pieData;

        // this.iraWorth = ((this.iraWorth / this.totalNetworth) * 100);
        // console.log('IRA = ' + this.iraWorth);
        const pieChartItemIRA = { 'name': 'IRA', 'value': parseFloat((IRATotal).toFixed(2)) }
        pieData.push(pieChartItemIRA);
        this.dataPie = pieData;

        // this._529Worth = ((this._529Worth / this.totalNetworth) * 100);
        // console.log('529 = ' + this._529Worth);
        const pieChartItemMF = { 'name': '529', 'value': parseFloat((_529Total).toFixed(2)) }
        pieData.push(pieChartItemMF);
        this.dataPie = pieData;
      });
    });


  }

  ngOnInit() {
  }
  setLabelFormatting(c): string {
    return `${c.label}<br/><span class="custom-label-text">${c.value}</span>`;
  }
  onSelect(event) {
    console.log(event);
    //this.investedAmount.forEach
  }

}
