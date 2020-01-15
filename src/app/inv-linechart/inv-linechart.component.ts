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
  view: any[] = [600, 300];

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


      const filterNetworth = this.networth.slice(Math.max(this.networth.length - 30, 0))

      const yAxis_401k = new Array<any>();
      const yAxis_529 = new Array<any>();
      const yAxis_ira = new Array<any>();

      for (let i = 0; i < filterNetworth.length; i++) {
        const _401K = {
          'name': this.getFormattedDate(filterNetworth[i].insertDate),
          'value': Number(filterNetworth[i].totalAmount._401K)
        }
        yAxis_401k.push(_401K);

        const Roth_IRA = {
          'name': this.getFormattedDate(filterNetworth[i].insertDate),
          'value': Number(filterNetworth[i].totalAmount.Roth_IRA)
        }
        yAxis_ira.push(Roth_IRA);

        const _529 = {
          'name': this.getFormattedDate(filterNetworth[i].insertDate),
          'value': Number(filterNetworth[i].totalAmount._529)
        }
        yAxis_529.push(_529);

      }

      const multi = [
        {
          'name': '401K',
          'series': yAxis_401k
        },
        {
          'name': '529',
          'series': yAxis_529
        },
        {
          'name': 'IRA',
          'series': yAxis_ira
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

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
