import { Component, OnInit } from '@angular/core';
import { NetworthService } from 'app/service/networth.service';
import { NetWorth } from 'app/model/modelNetWorth';
import { data } from 'jquery';

@Component({
  selector: 'app-inv-linechart',
  templateUrl: './inv-linechart.component.html',
  styleUrls: ['./inv-linechart.component.scss']
})
export class InvLinechartComponent implements OnInit {

  multi: any[] = [];
  view: any[] = [500, 300];

  // options
  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Year';
  yAxisLabel = 'Population';
  timeline = true;

  colorScheme = {
    domain: ['black', 'red', 'blue']
  };

  networth: NetWorth[];

  constructor(private netWorthSvc: NetworthService) {
  }

  ngOnInit(): void {
    this.netWorthSvc.getNetworth().subscribe(allNetworth => {
      this.networth = allNetworth;

      const sortedNetworth = this.networth.sort(function (a, b) {
        return a.insertDate > b.insertDate ? 1 : a.insertDate < b.insertDate ? -1 : 0;
      });

      const currDate = new Date();
      currDate.setDate(1);
      currDate.setMonth(currDate.getMonth() - 1);


      const filterNetworth = this.networth.slice(Math.max(this.networth.length - 15, 0))

      const netWorth = new Array<any>();

      for (let i = 0; i < filterNetworth.length; i++) {
        const _401K = {
          'name': this.getFormattedDate(filterNetworth[i].insertDate),
          'value': Number(parseFloat(filterNetworth[i].totalAmount._401K) +
            parseFloat(filterNetworth[i].totalAmount.Roth_IRA) + parseFloat(filterNetworth[i].totalAmount._529))
        }
        netWorth.push(_401K);

      }

      const multi = [
        {
          'name': 'Net Worth',
          'series': netWorth
        }
      ]
      Object.assign(this, { multi });
      console.log('filterNetworth', filterNetworth)
    });


  }

  getFormattedDate(givenDate: Date) {
    const dateString: String = new Date(givenDate).toLocaleDateString();
    return dateString.substring(0, dateString.lastIndexOf('/'));
  }



}
