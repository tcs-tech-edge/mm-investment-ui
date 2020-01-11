import { Component, OnInit } from '@angular/core';
import { InvestmentServiceService } from '../service/investment-service.service';
import { Customer } from '../model/customer';




@Component({
  selector: 'app-invest-piechart',
  templateUrl: './invest-piechart.component.html',
  styleUrls: ['./invest-piechart.component.scss']
})
export class InvestPiechartComponent implements OnInit {



  view: any[] = [275, 200];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Number';
  showYAxisLabel = true;
  doughnut = false;
  explodeSlices=false;
  yAxisLabel = 'Color Value';
  timeline = true;
  colorScheme = 'cool';
  showLabels=false;
  legendPosition='below';

  investedAmount: Customer[];
  dataPie: any[] = new Array();
  _401kNetWorth:number = 0;
  iraWorth: number = 0;
  _529Worth: number =0;
  totalNetworth: number = 0;
  
  tableData: Customer[];
  constructor(private investmentService: InvestmentServiceService) { 
    const pieData: any[] = new Array();
    investmentService.getTotalInvestmentDetails().subscribe(data => {
      console.log(data);
      this.investedAmount = data;
      this.tableData = data;
      this.investedAmount.forEach(model => {
        if(model.totalAmount._401K){  this._401kNetWorth = Math.floor(model.totalAmount._401K); }
        if(model.totalAmount._529) {this._529Worth= Math.floor(model.totalAmount._529);}
        if(model.totalAmount.Roth_IRA) { this.iraWorth = Math.floor(model.totalAmount.Roth_IRA);}
      });
      this.totalNetworth = (this._401kNetWorth + this._529Worth + this.iraWorth);
      console.log('totalNetworth = '+this.totalNetworth);
      console.log('_401kNetWorth = '+this._401kNetWorth);
      console.log('_529Worth = '+this._529Worth);
      console.log('iraWorth = '+this.iraWorth);

      this._401kNetWorth = ((this._401kNetWorth/this.totalNetworth) * 100);
      console.log('401K = '+this._401kNetWorth);
      const pieChartItem401 = { 'name': '401 K', 'value': this._401kNetWorth}
      pieData.push(pieChartItem401);
      this.dataPie = pieData;

      this.iraWorth = ((this.iraWorth/this.totalNetworth) * 100);
      console.log('IRA = '+this.iraWorth);
      const pieChartItemIRA = { 'name': 'IRA', 'value': this.iraWorth }
      pieData.push(pieChartItemIRA);
      this.dataPie = pieData;

      this._529Worth = ((this._529Worth/this.totalNetworth) * 100);
      console.log('529 = '+this._529Worth);
      const pieChartItemMF = { 'name': '529', 'value': this._529Worth }
      pieData.push(pieChartItemMF);
      this.dataPie = pieData;

    });
  }

  ngOnInit() {
  }

  onSelect(event){
    console.log(event);
    //this.investedAmount.forEach
  }

}
