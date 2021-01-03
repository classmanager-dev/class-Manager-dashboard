import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.css']
})
export class DashboardDetailsComponent implements OnInit {
  cities3 = [
    {id: 1, name: 'Mois'},
    {id: 2, name: 'Janvier'},
    {id: 2, name: 'Féverier'},
    {id: 2, name: 'Mars'},
    {id: 2, name: 'Avril'},
    {id: 2, name: 'Mai'},
  ];
  selectedCityName = 'Mois';
  
  constructor() { }

  ngOnInit(): void {
    var chart = new Chart("canvas", {
      type: 'line',
      data: {
        labels: ["01/01", "03/01", "05/01", "09/01", "11/01", "13/01","15/01","17/01","19/01","21/01","25/01","27/01","29/01"],
        datasets: [{
          label: '# of Votes',
          data: [50000, 90000, 70000, 50000, 70000,120000,70000,110000,200000,190000,170000,150000,250000],
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
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel;
            }
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
              beginAtZero: true
            },
            gridLines: {
              drawBorder: true,
              display: false
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor:"#36445D",
              fontFamily:"latoBold"
            },
            gridLines: {
              drawBorder: true,
              display: false
            }
          }]
        }
      }
    });
  }

}
