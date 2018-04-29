import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { KeyHilightsService } from '../key-hilights.service';
import { AngularFontAwesomeService } from 'angular-font-awesome';
import { ChartComponent } from 'angular2-chartjs';

@Component({
  selector: 'app-key-highlights-page',
  templateUrl: './key-highlights-page.component.html',
  styleUrls: ['./key-highlights-page.component.css'],
  providers: [NgbDropdownConfig, KeyHilightsService, AngularFontAwesomeService]
})
export class KeyHighlightsPageComponent implements OnInit {
  @ViewChild('grid1configChart') chart1: ChartComponent;
  @ViewChild('grid2configChart') chart2: ChartComponent;
  @ViewChild('grid3configChart') chart3: ChartComponent;
  @ViewChild('grid4configChart') chart4: ChartComponent;
  sourceSystem = {};
  lobFilter = {};
  yearQuarterFilter = {};
  grid3loaded = false;
  grid4loaded = false;
  tRecords: String;
  dqriScore: String;
  dqpScore: String;
  impactScore: String;
  drop2: String[] = [];
  drop3: String[] = [];
  drop4: String[] = [];

  grid3config = {
    type: 'horizontalBar',
    data: {
      labels: ['ECDEs', 'BCDEs'],
      datasets: [
        {
          label: 'Not DQ Monitered',
          data: [],
          backgroundColor: '#b32d00',
          hoverBackgroundColor: '#b32d00'
        },
        {
          label: 'DQ Monitered',
          data: [],
          backgroundColor: '#00b359',
          hoverBackgroundColor: '#00b359'
        }
      ]
    },

    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontFamily: 'Open Sans Bold, sans-serif',
              fontSize: 11
            },
            scaleLabel: {
              display: true
            },
            gridLines: {},
            stacked: true
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
              color: '#fff',
              zeroLineColor: '#fff',
              zeroLineWidth: 0
            },
            ticks: {
              fontFamily: 'Open Sans Bold, sans-serif',
              fontSize: 11
            },
            stacked: true
          }
        ]
      },
      legend: {
        display: true
      }
    }
  };

  grid4config = {
    type: 'bar',
    data: {
      labels: ['Jul-Sep 2014', 'Oct-Dec 2014'],
      datasets: [
        {
          label: '<30 days',
          data: [],
          stack: 'Stack 0',
          backgroundColor: '#00b359'
        },
        {
          label: '60 days',
          data: [],
          stack: 'Stack 0',
          backgroundColor: '#cccc00'
        },
        {
          label: '30-60 days',
          data: [],
          stack: 'Stack 0',
          backgroundColor: '#b32d00'
        }
      ]
    },
    options: {
      responsive: true
    }
  };

  grid1config = {
    type: 'bar',
    data: {
      labels: ['Prior Quarter'],
      datasets: [
        {
          label: '',
          data: [],
          backgroundColor: '#00b359'
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  };

  grid2config = {
    type: 'bar',
    data: {
      labels: ['Current Quarter'],
      datasets: [
        {
          label: '',
          data: [],
          backgroundColor: '#b32d00'
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  };
  service: KeyHilightsService;
  constructor(KeyHighlightsService: KeyHilightsService, ngbDropdownConfig: NgbDropdownConfig) {
    this.service = KeyHighlightsService;
    ngbDropdownConfig.autoClose='outside';
  }

  ngOnInit() {
    this.service.getData().then(dataaa => {
      var recievedData_1 = this.service.getdQRIAndDQPScoresData();
      this.tRecords = Math.round(recievedData_1['totalRecords']).toString();
      this.dqriScore = recievedData_1['dqriScore'].toString();
      this.dqpScore = recievedData_1['dqpScore'].toString() + '%';
      this.impactScore = recievedData_1['impactScore'].toString();

      var WholeData = this.service.getlistOfDQMoniteringStatsData();
      var hpDqIssues = this.service.getlistOfHighPriorityDQIssuesData();
      var openDQIssues = this.service.getopenDQIssuesData();

      for (var l in WholeData) {
        if (
          WholeData[l] &&
          this.drop3.indexOf(WholeData[l]['yearQuarter']) === -1
        ) {
          this.drop3.push(WholeData[l]['yearQuarter']);
          this.yearQuarterFilter[WholeData[l]['yearQuarter']] = true;
        }
      }
      for (var j in WholeData) {
        if (WholeData[j] && this.drop4.indexOf(WholeData[j]['lob']) === -1) {
          this.drop4.push(WholeData[j]['lob']);
          this.lobFilter[WholeData[j]['lob']] = true;
        }
      }
      for (var k in WholeData) {
        if (this.drop2.indexOf(WholeData[k]['sourceSystem']) === -1) {
          this.drop2.push(WholeData[k]['sourceSystem']);
          this.sourceSystem[WholeData[k]['sourceSystem']] = true;
        }
      }

      for (var i in WholeData) {
        if (WholeData[i]) {
          if (WholeData[i]['label'] === 'ECDEs') {
            this.grid3config.data.datasets[0].data.push(
              WholeData[0]['notDQMonitered']
            );
            this.grid3config.data.datasets[1].data.push(
              WholeData[0]['dqMonitered']
            );
          }
          if (WholeData[i]['label'] === 'BCDEs') {
            this.grid3config.data.datasets[0].data.push(
              WholeData[1]['notDQMonitered']
            );
            this.grid3config.data.datasets[1].data.push(
              WholeData[1]['dqMonitered']
            );
          }
        }
      }
      this.grid3loaded = true;
      this.grid4config.data.datasets[0].data.push(
        hpDqIssues[1]['nbrOfIssues'],
        hpDqIssues[4]['nbrOfIssues']
      );

      this.grid4config.data.datasets[1].data.push(
        hpDqIssues[2]['nbrOfIssues'],
        hpDqIssues[5]['nbrOfIssues']
      );

      this.grid4config.data.datasets[2].data.push(
        hpDqIssues[0]['nbrOfIssues'],
        hpDqIssues[3]['nbrOfIssues']
      );

      this.grid4loaded = true;
      this.grid1config.data.datasets[0].data.push(openDQIssues['priorQuarter']);
      this.grid2config.data.datasets[0].data.push(
        openDQIssues['currentQuarter']
      );
    });
  }

  filtergrid3(e) {
    var WholeData = this.service.getlistOfDQMoniteringStatsData();
    this.grid3config.data.datasets[0].data = [];
    this.grid3config.data.datasets[1].data = [];
    for (var i in WholeData) {
      if (WholeData[i]) {
        console.log(WholeData[i]);
        if (
          WholeData[i]['label'] === 'ECDEs' &&
          this.lobFilter[WholeData[i]['lob']] &&
          this.sourceSystem[WholeData[i]['sourceSystem']] &&
          this.yearQuarterFilter[WholeData[i]['yearQuarter']]
        ) {
          this.grid3config.data.datasets[0].data.push(
            WholeData[0]['notDQMonitered']
          );
          this.grid3config.data.datasets[1].data.push(
            WholeData[0]['dqMonitered']
          );
        }
        if (
          WholeData[i]['label'] === 'BCDEs' &&
          this.sourceSystem[WholeData[i]['sourceSystem']]
        ) {
          this.grid3config.data.datasets[0].data.push(
            WholeData[1]['notDQMonitered']
          );
          this.grid3config.data.datasets[1].data.push(
            WholeData[1]['dqMonitered']
          );
        }
      }
    }
    this.chart3.data = this.grid3config.data;
    this.chart3.chart.update();
  }
}
