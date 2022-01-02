import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { RestService } from 'src/app/services/rest.service';


@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.css']
})

export class DashboardDetailsComponent implements OnInit {
  selectedMonth: any;
  stats: any
  capacityByFormation: any[] = []
  date: any[] = []
  payment: any[] = []
  data: any
  chart: any
  constructor(private route: ActivatedRoute, private rest: RestService, private datePipe: DatePipe) { }
  public barChartOptions = {
    responsive: true,
    legend: {
      display: false,
      position: 'bottom',
    },
    tooltips: {
      callbacks: {
        // label: function (tooltipItem) {
        //   return tooltipItem.yLabel;
        // }
      },
      backgroundColor: "#fff",
      titleFontColor: "#08102B",
      titleFontFamily: "latoMeduim",
      bodyFontColor: "#3762F6",
      bodyFontFamily: "latoMeduim",
      xPadding: 20,
      borderWidth: 1,
      borderColor: "#3762F633",
      displayColors: false
    },
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
          autoSkip: true,
          maxTicksLimit: 15
        },
        gridLines: {
          drawBorder: true,
          display: false
        }
      }],
      xAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: "#36445D",
          fontFamily: "latoBold",
          autoSkip: true,
          maxTicksLimit: 15
        },
        gridLines: {
          drawBorder: true,
          display: false
        }
      }]
    }
  };
  public barChartType = 'line';
  public barChartLegend = false;

  ngOnInit(): void {
    this.getCenter(localStorage.getItem('center'))
  }
  getCenter(id) {
    let date: any[] = []
    let payment: any[] = []
    this.rest.getCentresStats(id).subscribe(result => {
      this.rest.getCoursesByCenter(id, 1).subscribe(res => {
        res.results.forEach(element => {
          this.rest.getCourseStudents(element.id, 1).subscribe(results => {
            let percentage: any
            percentage = ((results.count / element.capacity).toPrecision(5))
            this.capacityByFormation.push({ course_name: element.name, course_capacity: element.capacity, course_students: results.count, capacity_percentage: percentage * 100 })
          })
        });
      })
      this.selectedMonth = result.body.stats_by_months[result.body.stats_by_months.length - 1]
      this.manageDate()
      result.body.stats_of_month.forEach(element => {
        element.date = this.datePipe.transform(new Date(element.date), 'dd/MM')
        date.push(element.date)
        payment.push(element.payment)
      });
      this.date = date
      this.payment = payment
      this.configureChart()
      this.stats = result.body
    })
  }
  manageDate() {
    let selectedDate = new Date(this.selectedMonth.date)
    let selectedYear = selectedDate.getFullYear()
    this.selectedMonth.selectedYear = selectedYear
    console.log(selectedDate.getMonth());
    
    switch (selectedDate.getUTCMonth() + 1) {
      case 1:
        this.selectedMonth.month = "Janvier"
        break;
      case 2:
        this.selectedMonth.month = "Févirier"
        break;
      case 3:
        this.selectedMonth.month = "Mars"
        break;
      case 4:
        this.selectedMonth.month = "Avril"
        break;
      case 5:
        this.selectedMonth.month = "Mai"
        break;
      case 6:
        this.selectedMonth.month = "Juin"
        break;
      case 7:
        this.selectedMonth.month = "Juillet"
        break;
      case 8:
        this.selectedMonth.month = "Aout"
        break;
      case 9:
        this.selectedMonth.month = "Septembre"
        break;
      case 10:
        this.selectedMonth.month = "Octobre"
        break;
      case 11:
        this.selectedMonth.month = "Novembre"
        break;
      case 12:
        this.selectedMonth.month = "Décembre"
        break;
    }
  }
  selectMonth() {
    let date = this.selectedMonth.date
    date = date.replace(/\-/g, '/')
    this.rest.getCentreStats(localStorage.getItem('center'), date).subscribe(res => {
      let payement: any = []
      let date: any = []
      res.body.stats_of_month.forEach(element => {
        date.push(element.date)
        payement.push(element.payment)
      });
      this.date = date
      this.payment = payement
      this.configureChart()
      this.manageDate()

    })
  }
  configureChart() {
    this.payment = [{
      data: this.payment, 
      borderColor: ['#3762F6'], 
      fill: false, 
      borderWidth: 3,
      pointBorderWidth: 2,
      pointBackgroundColor: '#fff',
      pointHoverBorderColor	:"#3762F6",
      pointBorderColor: '#3762F6',
      pointRadius: 4
    }]
    this.date = this.date

  }
}
