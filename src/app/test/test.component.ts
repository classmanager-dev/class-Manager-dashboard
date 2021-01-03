import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  chart = [];

  constructor() { }

  ngOnInit() {
    var myChart = new Chart("canvas", {
      type: 'line',
      data: {
        labels: ["01/01", "03/01", "05/01", "09/01", "11/01", "13/01", "15/01", "17/01", "19/01", "21/01", "25/01", "27/01", "29/01"],
        datasets: [{
          label: 'En stock',
          data: [40, 70, 60, 90, 110, 75, 160, 190, 200, 220, 210,200,210,230 ],
          fill: false,
          borderColor: "#27CC09",
          lineTension: 0,
          // pointBorderWidth:0
        },
        {
          label: 'Vendu',
          data: [30, 60, 50, 70, 90, 70, 150, 170, 180, 200, 180, 190,200],
          fill: false,
          borderColor: "#0089FF",
          lineTension: 0


        },
        {
          label: 'En livraison',
          data: [0, 5, 3, 8, 9, 4, 5, 9, 10, 11, 13, 15, 14],
          fill: false,
          borderColor: "#FF9D00",
          lineTension: 0


        }
        ]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        legend:{

        } ,      
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              console.log(tooltipItem);
              
              return tooltipItem.yLabel;
            }
          },
          backgroundColor: "#fff",
          titleFontColor: "#08102B",
          titleFontFamily: "latoMeduim",
          bodyFontColor: "#000",
          bodyFontFamily: "latoMeduim",
          xPadding: 20,
          borderWidth: 1,
          borderColor: "#00000029",
          displayColors: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor:"#738987",
              fontFamily:"latoBold"
            },
            gridLines: {
              borderDash:[5,15]
            }                                                        
          }
          ],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor:"#738987",
              fontFamily:"latoBold"
            },
            gridLines: {
              display: false
            },
          },
          
          ]
        }
      }
    });
  }
}
