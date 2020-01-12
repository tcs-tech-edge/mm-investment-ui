import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { NetworthService } from 'app/service/networth.service';
import { NetWorth } from 'app/model/modelNetWorth';
import { ConsolidatedNetworth } from 'app/model/modelNetworthWeek';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _nws: NetworthService) {}

  networth: NetWorth[];

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
  };


  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };

  weeklyNetAmount_401: Map<String, Array<number>>;
  weeklyNetAmount_529: Map<String, Array<number>>;
  weeklyNetAmount_ira: Map<String, Array<number>>;

  wn_401: ConsolidatedNetworth;
  wn_529: ConsolidatedNetworth;
  wn_ira: ConsolidatedNetworth;

  weekly_max_401k_total: number;
  weekly_max_529_total: number;
  weekly_max_ira_total: number;

  monthlyNetAmount_401: Map<String, Array<number>>;
  monthlyNetAmount_529: Map<String, Array<number>>;
  monthlyNetAmount_ira: Map<String, Array<number>>;

  mn_401: ConsolidatedNetworth;
  mn_529: ConsolidatedNetworth;
  mn_ira: ConsolidatedNetworth;

  monthly_max_401k_total: number;
  monthly_max_529_total: number;
  monthly_max_ira_total: number;

  convertMonthlyPlot(networth: NetWorth[]) {
    console.log("Start convertMonthlyPlot");

    this.monthlyNetAmount_401 = new Map<String, Array<number>>();
    this.monthlyNetAmount_529 = new Map<String, Array<number>>();
    this.monthlyNetAmount_ira = new Map<String, Array<number>>();

    for (let i = 1; i <= 12; i++) {
      let mString = "m" + i;
      this.monthlyNetAmount_401.set(mString, new Array<number>());
      this.monthlyNetAmount_529.set(mString, new Array<number>());
      this.monthlyNetAmount_ira.set(mString, new Array<number>());
    }

    for (let i = 0; i < networth.length; i++) {

      let yearValue = new Date(networth[i].insertDate).getFullYear();
      if (yearValue == 2019) {
        let givenMonth = new Date(networth[i].insertDate).getMonth() + 1;

        let monthString = "m" + givenMonth;
        let amount_401k = networth[i].totalAmount._401K;
        let amount_529 = networth[i].totalAmount._529;
        let amount_ira = networth[i].totalAmount.Roth_IRA;

        if (this.monthlyNetAmount_401.has(monthString)) {
          let amountArray_401: Number[] = this.monthlyNetAmount_401.get(monthString);
          amountArray_401.push(Number(amount_401k));
        }

        if (this.monthlyNetAmount_529.has(monthString)) {
          let amountArray_529: Number[] = this.monthlyNetAmount_529.get(monthString);
          amountArray_529.push(Number(amount_529));
        }

        if (this.monthlyNetAmount_ira.has(monthString)) {
          let amountArray_ira: Number[] = this.monthlyNetAmount_ira.get(monthString);
          amountArray_ira.push(Number(amount_ira));
        }
      }
    }

    // console.log(this.monthlyNetAmount_401);
    // console.log(this.monthlyNetAmount_529);
    // console.log(this.monthlyNetAmount_ira);

    this.mn_401 = new ConsolidatedNetworth();
    this.mn_529 = new ConsolidatedNetworth();
    this.mn_ira = new ConsolidatedNetworth();

    this.mn_401.weekNumberArray = new Array<String>();
    this.mn_401.weeklyTotalArray = new Array<number>();

    this.mn_529.weekNumberArray = new Array<String>();
    this.mn_529.weeklyTotalArray = new Array<number>();

    this.mn_ira.weekNumberArray = new Array<String>();
    this.mn_ira.weeklyTotalArray = new Array<number>();

    this.getPlottingValues(this.monthlyNetAmount_401, this.mn_401);
    this.getPlottingValues(this.monthlyNetAmount_529, this.mn_529);
    this.getPlottingValues(this.monthlyNetAmount_ira, this.mn_ira);

    // console.log(JSON.stringify(this.mn_401));
    // console.log(JSON.stringify(this.mn_529));
    // console.log(JSON.stringify(this.mn_ira));

    this.monthly_max_401k_total = Math.max.apply(Math, this.mn_401.weeklyTotalArray.map(function (o) { return o; }))
    this.monthly_max_529_total = Math.max.apply(Math, this.mn_529.weeklyTotalArray.map(function (o) { return o; }))
    this.monthly_max_ira_total = Math.max.apply(Math, this.mn_ira.weeklyTotalArray.map(function (o) { return o; }))

    // console.log("The max value of monthly 401k is: " + this.monthly_max_401k_total);
    // console.log("The max value of monthly 529 is: " + this.monthly_max_529_total);
    // console.log("The max value of monthly ira is: " + this.monthly_max_ira_total);

    //console.log("End convertMonthlyPlot");
  }

  convertWeeklyPlot(networth: NetWorth[]) {

    console.log("Inside convert convertWeeklyPlot");

    this.weeklyNetAmount_401 = new Map<String, Array<number>>();
    this.weeklyNetAmount_529 = new Map<String, Array<number>>();
    this.weeklyNetAmount_ira = new Map<String, Array<number>>();

    for (let i = 1; i <= 53; i++) {
      let wString = "w" + i;
      this.weeklyNetAmount_401.set(wString, new Array<number>());
      this.weeklyNetAmount_529.set(wString, new Array<number>());
      this.weeklyNetAmount_ira.set(wString, new Array<number>());
    }

    for (let i = 0; i < networth.length; i++) {

      let yearValue = new Date(networth[i].insertDate).getFullYear();

      if (yearValue == 2019) {
        let givenWeek = this.getWeek(new Date(networth[i].insertDate));

        let weekString = "w" + givenWeek;

        let amount_401k = networth[i].totalAmount._401K;
        let amount_529 = networth[i].totalAmount._529;
        let amount_ira = networth[i].totalAmount.Roth_IRA;

        if (this.weeklyNetAmount_401.has(weekString)) {
          let amountArray_401: Number[] = this.weeklyNetAmount_401.get(weekString);
          amountArray_401.push(Number(amount_401k));
        }
        
        // else{
        //   this.weeklyNetAmount_401.set(weekString, new Array<number>());
        // }

        if (this.weeklyNetAmount_529.has(weekString)) {
          let amountArray_529: Number[] = this.weeklyNetAmount_529.get(weekString);
          amountArray_529.push(Number(amount_529));
        }
        
        // else{
        //   this.weeklyNetAmount_529.set(weekString, new Array<number>());
        // }

        if (this.weeklyNetAmount_ira.has(weekString)) {
          let amountArray_ira: Number[] = this.weeklyNetAmount_ira.get(weekString);
          amountArray_ira.push(Number(amount_ira));
        }
        
        // else{
        //   this.weeklyNetAmount_ira.set(weekString, new Array<number>());
        // }
      }
    }

    // console.log(this.weeklyNetAmount_401);
    // console.log(this.weeklyNetAmount_529);
    // console.log(this.weeklyNetAmount_ira);

    this.wn_401 = new ConsolidatedNetworth();
    this.wn_529 = new ConsolidatedNetworth();
    this.wn_ira = new ConsolidatedNetworth();

    this.wn_401.weekNumberArray = new Array<String>();
    this.wn_401.weeklyTotalArray = new Array<number>();

    this.wn_529.weekNumberArray = new Array<String>();
    this.wn_529.weeklyTotalArray = new Array<number>();

    this.wn_ira.weekNumberArray = new Array<String>();
    this.wn_ira.weeklyTotalArray = new Array<number>();

    this.getPlottingValues(this.weeklyNetAmount_401, this.wn_401);
    this.getPlottingValues(this.weeklyNetAmount_529, this.wn_529);
    this.getPlottingValues(this.weeklyNetAmount_ira, this.wn_ira);

    // console.log("wn_401: " + JSON.stringify(this.wn_401));
    // console.log("wn_529: " + JSON.stringify(this.wn_529));
    // console.log("wn_ira: " + JSON.stringify(this.wn_ira));

    // let tempWeekStringArray = new Array<String>();
    // let tempWeekTotalArray = new Array<number>();

    // for(let i=0;i<this.wn_401.weekNumberArray.length;i++){

    //   console.log("Outside: "+this.wn_401.weeklyTotalArray[i]);

    //   if(!Number.isNaN(this.wn_401.weeklyTotalArray[i])){

    //     console.log("Inside: "+this.wn_401.weeklyTotalArray[i]);

    //     tempWeekStringArray.push(this.wn_401.weekNumberArray[i]);
    //     tempWeekTotalArray.push(this.wn_401.weeklyTotalArray[i]);
    //   }
    // }

    // this.wn_401.weekNumberArray = tempWeekStringArray;
    // this.wn_401.weeklyTotalArray = tempWeekTotalArray;

    // console.log("wn_401 after change: " + JSON.stringify(this.wn_401));

    this.weekly_max_401k_total = Math.max.apply(Math, this.wn_401.weeklyTotalArray.map(function (o) { return o; }))
    this.weekly_max_529_total = Math.max.apply(Math, this.wn_529.weeklyTotalArray.map(function (o) { return o; }))
    this.weekly_max_ira_total = Math.max.apply(Math, this.wn_ira.weeklyTotalArray.map(function (o) { return o; }))

    // console.log("The max value of 401k is: " + this.weekly_max_401k_total);
    // console.log("The max value of 529 is: " + this.weekly_max_529_total);
    // console.log("The max value of ira is: " + this.weekly_max_ira_total);

    console.log("End of convertWeeklyPlot");
  }

  getPlottingValues(givenInputMap: Map<String, Array<number>>, result: ConsolidatedNetworth) {

    givenInputMap.forEach((value: Array<number>, key: String) => {

      if (key != "w1") {
        let sum = 0;
        for (let i = 0; i < value.length; i++) {
          sum = sum + value[i];
        }

        //console.log(key + " == " + sum + " == " + Math.round(sum));

        if(!Number.isNaN(Math.round(sum))){
          result.weekNumberArray.push(key);
          result.weeklyTotalArray.push(Math.round(sum));
        }
        
      }
    });
   
  }

  getWeek(d: Date): Number {

    // Create a copy of this date object  
    var target: any = new Date(d.valueOf());

    // ISO week date weeks start on monday  
    // so correct the day number  
    var dayNr: number = (d.getDay() + 6) % 7;

    // Set the target to the thursday of this week so the  
    // target date is in the right year  
    target.setDate(target.getDate() - dayNr + 3);

    // ISO 8601 states that week 1 is the week  
    // with january 4th in it  
    var jan4: any = new Date(target.getFullYear(), 0, 4);

    // Number of days between target date and january 4th  
    var dayDiff = (target - jan4) / 86400000;

    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between target date and january 4th    
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;

  }

  retrieveMonthlyTestChart(totalValueArray: number[], increment:number, maxValue: number, target: String){
    const dataDailySalesChart: any = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        totalValueArray
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      height: 300,
      low: 0,
      high: maxValue + increment, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 30 },
      axisY: {
        labelInterpolationFnc: function(value:any) {
          //console.log("The values are: "+ value + " == " + "$" + Number((value).toFixed(1)).toLocaleString());
          return "$" + Number((value).toFixed(1)).toLocaleString();
        }
      }
    }

    var dailySalesChart = new Chartist.Line(target, dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
  }

  retrieveMonthlyChart(totalValueArray: number[], increment:number, maxValue: number, target: String) {
    const dataDailySalesChart: any = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        totalValueArray
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      height: 300,
      low: 0,
      high: maxValue + increment, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 30 },
      axisY: {
        labelInterpolationFnc: function(value:any) {
          //console.log("The values are: "+ value + " == " + "$" + Number((value).toFixed(1)).toLocaleString());
          return "$" + Number((value).toFixed(1)).toLocaleString();
        }
      }
    }

    var dailySalesChart = new Chartist.Line(target, dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
  }


  retrieveWeeklyChart(weeklyArray: String[], increment:number, totalValueArray: number[], maxValue: number, target: String) {
    const dataDailySalesChart: any = {
      labels: weeklyArray,
      series: [
        totalValueArray
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: maxValue + increment, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 30 },
      axisY: {
        labelInterpolationFnc: function(value:any) {
          //console.log("The values are: "+ value + " == " + "$" + Number((value).toFixed(1)).toLocaleString());
          return "$" + Number((value).toFixed(1)).toLocaleString();
        }
      }
    }

    var dailySalesChart = new Chartist.Line(target, dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
  }



  ngOnInit() {

    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    this._nws.getNetworth().subscribe(allNetworth => {
      this.networth = allNetworth;
      this.convertWeeklyPlot(this.networth);
      this.convertMonthlyPlot(this.networth);

      this.retrieveMonthlyChart(this.mn_401.weeklyTotalArray, 5000, this.monthly_max_401k_total, '#monthly_401k_chart');
      this.retrieveMonthlyChart(this.mn_529.weeklyTotalArray, 5000, this.monthly_max_529_total, '#monthly_529_chart');
      this.retrieveMonthlyChart(this.mn_ira.weeklyTotalArray, 0, this.monthly_max_ira_total, '#monthly_ira_chart');

      this.retrieveWeeklyChart(this.wn_401.weekNumberArray, 5000, this.wn_401.weeklyTotalArray, this.weekly_max_401k_total, '#weekly_401k_chart');
      this.retrieveWeeklyChart(this.wn_529.weekNumberArray, 5000, this.wn_529.weeklyTotalArray, this.weekly_max_529_total, '#weekly_529_chart');
      this.retrieveWeeklyChart(this.wn_ira.weekNumberArray, 0, this.wn_ira.weeklyTotalArray, this.weekly_max_ira_total, '#weekly_ira_chart');

      //this.retrieveMonthlyTestChart(this.mn_401.weeklyTotalArray, 5000, this.monthly_max_401k_total, '#testChart');
    });
    
  }

}
