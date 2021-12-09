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
  capacityByFormation:any[]=[]
  constructor(private route: ActivatedRoute, private rest: RestService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getCenter(this.route.snapshot.params['id'])
  }
  getCenter(id) {
    let date: any[] = []
    let payment: any[] = []
    this.rest.getCentresStats(id).subscribe(result => {
      this.rest.getCoursesByCenter(id,1).subscribe(res=>{
        res.results.forEach(element => {
          this.rest.getCourseStudents(element.id,1).subscribe(results=>{
            let percentage:any 
             percentage =((results.count/element.capacity).toPrecision(5))
            this.capacityByFormation.push({course_name:element.name,course_capacity:element.capacity,course_students:results.count,capacity_percentage:percentage*100})
          })
        });
      })
      console.log(result.body.stats_by_months.length-1);
      
      this.selectedMonth = result.body.stats_by_months[result.body.stats_by_months.length-1]
      this.selectMonth()
      result.body.stats_this_month.forEach(element => {
        element.date = this.datePipe.transform(new Date(element.date), 'dd/MM')
        date.push(element.date)
        payment.push(element.payment)
      });

      var chart = new Chart("canvas", {
        type: 'line',
        data: {
          labels: date,
          datasets: [{
            label: '',
            data: [50000, 90000, 70000, 50000, 70000, 120000, 70000, 110000, 200000, 190000, 170000, 150000, 210000, 50000, 90000, 70000, 50000],
            fill: false,

            borderColor: [
              '#3762F6'
            ],
            borderWidth: 3,
            pointBorderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#3762F6',
            pointRadius: 4
          }]
        },
        options: {
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
                fontFamily: "latoBold"
              },
              gridLines: {
                drawBorder: true,
                display: false
              }
            }]
          }
        }
      });
      this.stats = result.body
    })
  }
  selectMonth() {
    let selectedDate = new Date(this.selectedMonth.date)
    let selectedYear=selectedDate.getFullYear()
    this.selectedMonth.selectedYear = selectedYear
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
}
