import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
  lang: any
  constructor(private translateService: TranslateService, private rest: RestService, private datePipe: DatePipe) { }
  public barChartOptions = {
    responsive: true,
    legend: {
      display: false,
      position: 'bottom',
    },
    tooltips: {
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
          display: true,
          beginAtZero: true,
          autoSkip: true,
          fontColor: "#36445D",
          fontFamily: "latoBold",
          maxTicksLimit: 10
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
    this.lang = this.translateService.currentLang
  }
  getCenter(id) {
    this.rest.get('/centers/' + id + "/stats").subscribe(result => {
      this.rest.get('/centers/' + id + "/courses/?page=1").subscribe(res => {
        if (res?.status === 200) {
          res.body.results.forEach(element => {
            this.rest.get('/courses/' + element.id + '/students/?page=1').subscribe(results => {
              if (results?.status === 200) {
                let percentage: any
                percentage = ((results.body.count / element.capacity).toPrecision(5))
                this.capacityByFormation.push({ course_name: element.name, course_capacity: element.capacity, course_students: results.body.count, capacity_percentage: percentage * 100 })
              }
            })
          });
        }
      })
      this.selectedMonth = result.body.stats_by_months[result.body.stats_by_months.length - 1]
      this.manageDate(result.body)
      this.configureChart()
      this.stats = result.body
    })
  }
  manageDate(results) {
    let date: any[] = []
    let payment: any[] = []
    results.stats_of_month.forEach(element => {
      element.date = this.datePipe.transform(new Date(element.date), 'dd/MM')
      date.push(element.date)
      payment.push(element.payment)
    });
    this.date = date
    this.payment = payment
    let selectedDate = new Date(this.selectedMonth.date)
    let selectedYear = selectedDate.getFullYear()
    this.selectedMonth.selectedYear = selectedYear
    switch (selectedDate.getUTCMonth() + 1) {
      case 1:
        this.lang == 'fr' ? this.selectedMonth.month = "Janvier" : this.selectedMonth.month = "جانفي"
        break;
      case 2:
        this.lang == 'fr' ? this.selectedMonth.month = "Février" : this.selectedMonth.month = "فيفري"
        break;
      case 3:
        this.lang == 'fr' ? this.selectedMonth.month = "Mars" : this.selectedMonth.month = "مارس"
        break;
      case 4:
        this.lang == 'fr' ? this.selectedMonth.month = "Avril" : this.selectedMonth.month = "أفريل"
        break;
      case 5:
        this.lang == 'fr' ? this.selectedMonth.month = "Mai" : this.selectedMonth.month = "ماي"
        break;
      case 6:
        this.lang == 'fr' ? this.selectedMonth.month = "Juin" : this.selectedMonth.month = "جوان"
        break;
      case 7:
        this.lang == 'fr' ? this.selectedMonth.month = "Juillet" : this.selectedMonth.month = "جويلية"
        break;
      case 8:
        this.lang == 'fr' ? this.selectedMonth.month = "Août" : this.selectedMonth.month = "أوت"
        break;
      case 9:
        this.lang == 'fr' ? this.selectedMonth.month = "Septembre" : this.selectedMonth.month = "سبتمبر"
        break;
      case 10:
        this.lang == 'fr' ? this.selectedMonth.month = "Octobre" : this.selectedMonth.month = "أكتوبر"
        break;
      case 11:
        this.lang == 'fr' ? this.selectedMonth.month = "Novembre" : this.selectedMonth.month = "نوفمبر"
        break;
      case 12:
        this.lang == 'fr' ? this.selectedMonth.month = "Décembre" : this.selectedMonth.month = "ديسمبر"
        break;
    }
  }
  selectMonth() {
    let date = this.selectedMonth.date
    date = date.replace(/\-/g, '/')
    this.rest.get('/centers/' + localStorage.getItem('center') + '/stats/' + date).subscribe(res => {
      this.manageDate(res.body)
      this.configureChart()
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
      pointHoverBorderColor: "#3762F6",
      pointBorderColor: '#3762F6',
      pointRadius: 4
    }]
    this.date = this.date

  }
}
