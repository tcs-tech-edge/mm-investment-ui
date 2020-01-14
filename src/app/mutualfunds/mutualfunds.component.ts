import { Component, OnInit } from '@angular/core';
import { InvestmentServiceService } from '../service/investment-service.service';
import { InvestmentModel } from '../model/model401k';

import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
  keyframes
} from "@angular/animations";

@Component({
  selector: 'app-mutualfunds',
  templateUrl: './mutualfunds.component.html',
  styleUrls: ['./mutualfunds.component.scss'],
  animations: [
    trigger("listAnimation", [
      transition("* => *", [
        // each time the binding value changes
        query(
          ":leave",
          [stagger(100, [animate("0.5s", style({ opacity: 0 }))])],
          { optional: true }
        ),
        query(
          ":enter",
          [
            style({ opacity: 0 }),
            stagger(100, [animate("1s", style({ opacity: 1 }))])
          ],
          { optional: true }
        )
      ])
    ]),
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1, 'overflow-x': 'hidden'}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    ),
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(250, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(250, style({ height: '*' }))
      ])
    ])
  ]
})

export class MutualfundsComponent implements OnInit {

  view: any[] = [450, 250];
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
  avgMargin = 0;

  tabledata401kHeader: String[] = new Array();
  //tabledata401kData: any[] = new Array();
  colorScheme;
  total401kWorth = 0;

  tabledata_401k: any[] = new Array();
  tabledata_529: any[] = new Array();
  tabledata_ira: any[] = new Array();

  investmentModelArray: InvestmentModel[];
  // colorScheme = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };
  constructor(private investmentService: InvestmentServiceService) {

    // Header for the table
    let calcNetWorth = 0
    this.tabledata401kHeader.push('Fund Name');
    this.tabledata401kHeader.push('Number of Shares');
    this.tabledata401kHeader.push('Avg Purchase Price');
    this.tabledata401kHeader.push('Current Unit Price');
    this.tabledata401kHeader.push('Current Value');
    this.tabledata401kHeader.push('Margin');

    
    
    this.investmentService.get401kData().subscribe(data => {

      this.investmentModelArray = data;
      const datasize = this.investmentModelArray.length;

      const domain:any = new Array();

      let i = 0;
      this.investmentModelArray.forEach((model, index) => {

        domain.push(this.getRandomColor());

        this.investmentService.getCurrentPrice(model.ticker).subscribe(priceData => {
          
          const purchasePrice: any = parseFloat((model.purchase_price * model.number_of_shares).toFixed(2));
          const currentPrice: any = parseFloat((priceData['price'] * model.number_of_shares).toFixed(2));
          const margin = parseFloat(((currentPrice - purchasePrice) * 100 / purchasePrice).toFixed(2));
          this.avgMargin = this.avgMargin + margin;

          switch(model.investment_type){
            case "_529":{
              this.tabledata_529.push({
                'Fund_Name': model.ticker,
                'Shares': model.number_of_shares,
                'AvgPrice': purchasePrice,
                'StockPrice': priceData['price'],
                'CurVal': currentPrice,
                'Margin': margin
              })
              break;
            }

            case "_401K":{
              this.tabledata_401k.push({
                'Fund_Name': model.ticker,
                'Shares': model.number_of_shares,
                'AvgPrice': purchasePrice,
                'StockPrice': priceData['price'],
                'CurVal': currentPrice,
                'Margin': margin
              })
              break;
            }

            case "Roth_IRA":{
              this.tabledata_ira.push({
                'Fund_Name': model.ticker,
                'Shares': model.number_of_shares,
                'AvgPrice': purchasePrice,
                'StockPrice': priceData['price'],
                'CurVal': currentPrice,
                'Margin': margin
              })
              break;
            }

            default:{

            }
          }

          const pieChartItem = { 'name': model.ticker, 'value': currentPrice }
          calcNetWorth = calcNetWorth + currentPrice;
          //console.log('calNetWorth ' + calcNetWorth);
          //console.log('currentPrice ' + currentPrice);
          this.pieData.push(pieChartItem);
          i = i + 1;
          if (i === datasize) {
            this.data401k = this.pieData;
            this.colorScheme = { 'domain': domain };
            this.total401kWorth = calcNetWorth;
            this.avgMargin = parseFloat((this.avgMargin / (datasize)).toFixed(2));
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
