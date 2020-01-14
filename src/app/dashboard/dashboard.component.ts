import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { NetworthService } from 'app/service/networth.service';
import { InvestmentServiceService } from '../service/investment-service.service';
import { TransferService } from '../service/transfer.service';

import { NetWorth } from 'app/model/modelNetWorth';
import { ConsolidatedNetworth } from 'app/model/modelNetworthWeek';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  networth: NetWorth[];

  map_401k: Map<String, Array<number>>;
  map_529: Map<String, Array<number>>;
  map_ira: Map<String, Array<number>>;

  consolidated_401k: ConsolidatedNetworth;
  consolidated_529: ConsolidatedNetworth;
  consolidated_ira: ConsolidatedNetworth;

  max_401k_total: number;
  max_529_total: number;
  max_ira_total: number;

  min_401k_total: number;
  min_529_total: number;
  min_ira_total: number;

  currentTotal401k = 0;
  currentTotal529 = 0;
  currentTotalIRA = 0;

  accountTotalValue = 0;
  investedTotalValue = 0;
  profitValue: string;

  constructor(private _nws: NetworthService, private transferService: TransferService) { 
    this.transferService.totalAccountValue.subscribe( data => {
       this.investedTotalValue = data;
       console.log("Recievd in dashboard &&&&&&& "+this.accountTotalValue);
    });

    this.transferService.total401KValue.subscribe( _401kdata => {
      this.currentTotal401k = _401kdata;
      this.transferService.total529Value.subscribe( _529data => {
        this.currentTotal529 = _529data;
        this.transferService.totalIRAValue.subscribe( IRAdata => {
          this.currentTotalIRA = IRAdata;
          console.log(this.currentTotal401k + ' - ' + this.currentTotal529 + ' - '+ this.currentTotalIRA)
          this.accountTotalValue = this.currentTotal401k + this.currentTotal529 + this.currentTotalIRA;
          this.profitValue = (this.accountTotalValue - this.investedTotalValue).toFixed(2);
        });
      });
    });

    

    
  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  }

  getWeek(d: Date): Number {

    // Create a copy of this date object
    const target: any = new Date(d.valueOf());

    // ISO week date weeks start on monday
    // so correct the day number
    const dayNr: number = (d.getDay() + 6) % 7;

    // Set the target to the thursday of this week so the
    // target date is in the right year
    target.setDate(target.getDate() - dayNr + 3);

    // ISO 8601 states that week 1 is the week
    // with january 4th in it
    const jan4: any = new Date(target.getFullYear(), 0, 4);

    // Number of days between target date and january 4th
    const dayDiff = (target - jan4) / 86400000;

    // Calculate week number: Week 1 (january 4th) plus the
    // number of weeks between target date and january 4th
    const weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;

  }

  sortedNetworth:NetWorth[];

  ngOnInit() {

    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    this._nws.getNetworth().subscribe(allNetworth => {
      this.networth = allNetworth;

      //document.getElementById('dropdownMenu2').innerHTML = '5 DAYS';

      this.sortedNetworth = this.networth.sort(function (a, b) {
        return a.insertDate < b.insertDate ? 1 : a.insertDate > b.insertDate ? -1 : 0
      });

      this.getChartsForDays(this.sortedNetworth, 5);

      // TESTING CODE STARTS //

      // const dataCompletedTasksChart: any = {
      //   labels: ['12p', '3p', '6p'],
      //   series: [
      //     [230, 750, 450]
      //   ]
      // };

      // const optionsCompletedTasksChart: any = {
      //   lineSmooth: Chartist.Interpolation.cardinal({
      //     tension: 0
      //   }),
      //   low: 0,
      //   high: 1000,
      //   chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
      // }

      // var completedTasksChart = new Chartist.Line('#completedTasksChart',
      //   dataCompletedTasksChart,
      //   optionsCompletedTasksChart)
      //   .on("draw", function (data) {
      //     if (data.type === "point") {
      //       data.element._node.setAttribute("title", "" + data.value.y);
      //       data.element._node.setAttribute("data-chart-tooltip", "completedTasksChart");
      //     }
      //   }).on("created", function () {
      //     // Initiate Tooltip
      //     $("#completedTasksChart").tooltip({
      //       selector: '[data-chart-tooltip="completedTasksChart"]',
      //       container: "#completedTasksChart",
      //       html: true
      //     });
      //   });

      // // start animation for the Completed Tasks Chart - Line Chart
      // this.startAnimationForLineChart(completedTasksChart);

      // TESTING CODE ENDS //
    });

  }

  fiveDaysSelected() {
    console.log('FIVE days selected');
    document.getElementById('dropdownMenu2').innerHTML = '5 DAYS';

    this.getChartsForDays(this.sortedNetworth, 5);
  }

  twoWeeksSelected() {
    console.log('TWO weeks selected');
    document.getElementById('dropdownMenu2').innerHTML = '2 WEEKS';

    this.getChartsForDays(this.sortedNetworth, 10);
  }

  oneMonthSelected() {
    console.log('ONE month selected');
    document.getElementById('dropdownMenu2').innerHTML = '1 MONTH';
  }

  getChartsForDays(sortedNetworth: NetWorth[], days: number) {
    const firstFive = sortedNetworth.slice(0, days);

    console.log(firstFive);
    // this.convertToPlottingValues(firstFive, 5, "day");

    this.consolidated_401k = new ConsolidatedNetworth();
    this.consolidated_529 = new ConsolidatedNetworth();
    this.consolidated_ira = new ConsolidatedNetworth();

    this.getPlottingForDays(firstFive, this.consolidated_401k, this.consolidated_529, this.consolidated_ira);

    this.max_401k_total = Math.max.apply(Math, this.consolidated_401k.yAxisValues.map(function (o) { return o; }))
    this.max_529_total = Math.max.apply(Math, this.consolidated_529.yAxisValues.map(function (o) { return o; }))
    this.max_ira_total = Math.max.apply(Math, this.consolidated_ira.yAxisValues.map(function (o) { return o; }))

    // console.log('max 401k: ' + this.max_401k_total);
    // console.log('max 529: ' + this.max_529_total);
    // console.log('max ira: ' + this.max_ira_total);

    this.min_401k_total = Math.min.apply(Math, this.consolidated_401k.yAxisValues.map(function (o) { return o; }))
    this.min_529_total = Math.min.apply(Math, this.consolidated_529.yAxisValues.map(function (o) { return o; }))
    this.min_ira_total = Math.min.apply(Math, this.consolidated_ira.yAxisValues.map(function (o) { return o; }))

    // console.log('min 401k: ' + this.min_401k_total);
    // console.log('min 529: ' + this.min_529_total);
    // console.log('min ira: ' + this.min_ira_total);

    this.retrieveTestChart(this.consolidated_401k.xAxisValues, this.consolidated_401k.yAxisValues,
      10, 10, this.min_401k_total, this.max_401k_total, '#testChart_401k');
    this.retrieveTestChart(this.consolidated_529.xAxisValues, this.consolidated_529.yAxisValues,
      10, 10, this.min_529_total, this.max_529_total, '#testChart_529');
    this.retrieveTestChart(this.consolidated_ira.xAxisValues, this.consolidated_ira.yAxisValues,
      10, 10, this.min_ira_total, this.max_ira_total, '#testChart_ira');
  }

  getPlottingForDays(givenNetworthValues: NetWorth[], result1: ConsolidatedNetworth,
    result2: ConsolidatedNetworth, result3: ConsolidatedNetworth) {
    const xAxis = new Array<String>();

    const yAxis_401k = new Array<number>();
    const yAxis_529 = new Array<number>();
    const yAxis_ira = new Array<number>();

    for (let i = 0; i < givenNetworthValues.length; i++) {
      xAxis.push(this.getFormattedDate(givenNetworthValues[i].insertDate));
      yAxis_401k.push(Number(givenNetworthValues[i].totalAmount._401K));
      yAxis_529.push(Number(givenNetworthValues[i].totalAmount._529));
      yAxis_ira.push(Number(givenNetworthValues[i].totalAmount.Roth_IRA));
    }

    result1.xAxisValues = xAxis;
    result1.yAxisValues = yAxis_401k;

    result2.xAxisValues = xAxis;
    result2.yAxisValues = yAxis_529;

    result3.xAxisValues = xAxis;
    result3.yAxisValues = yAxis_ira;
  }

  getFormattedDate(givenDate: Date) {
    const dateString: String = new Date(givenDate).toLocaleDateString();
    return dateString.substring(0, dateString.lastIndexOf('/'));
  }

  retrieveTestChart(xAxisValues: String[], yAxisValues: number[], decrement: number,
    increment: number, minValue: number, maxValue: number, target: string) {

    const targetForToolTip: String = target.substring(1, target.length);
    const selectorForToolTip: string = '[data-chart-tooltip="' + targetForToolTip + '"]';

    const dataDailySalesChart: any = {
      labels: xAxisValues.reverse(),
      series: [
        yAxisValues.reverse()
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      height: 300,
      ticks: ['a', 'b', 'c', 'd', 'e'],
      low: minValue - decrement,
      high: maxValue + increment, //  tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 30 },
      axisY: {
        labelInterpolationFnc: function (value: any) {
          // console.log("The values are: "+ value + " == " + "$" + Number((value).toFixed(1)).toLocaleString());
          return '$' + Number((value).toFixed(1)).toLocaleString();
        }
      }
    }

    const dailySalesChart = new Chartist.Line(target, dataDailySalesChart, optionsDailySalesChart)
    // .on("draw", function (data) {
    //   if (data.type === "point") {
    //     data.element._node.setAttribute("title", "" + data.value.y);
    //     data.element._node.setAttribute("data-chart-tooltip", targetForToolTip);
    //   }
    // }).on("created", function () {
    //   // Initiate Tooltip
    //   $(target).tooltip({
    //     selector: selectorForToolTip,
    //     container: target,
    //     html: true
    //   });
    // });

    this.startAnimationForLineChart(dailySalesChart);
  }

}
