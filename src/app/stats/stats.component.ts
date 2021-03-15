import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

declare var google;
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {

  username = "username";
  qcm_done = 0;
  qcm_totale = 0;
  qcm_corrects = 0;
  qcm_done_faculte = {"FMT":0,"FMS":0,"FMM":0,"FMSo":0}
  qcm_done_annee = {"2020":0,"2019":0,"2018":0,"2017":0,"2016":0,"2015":0}
  // Series
  quiz_done = 0;
  quiz_totale = 0;




  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.qcm_done = 0;
    this.qcm_totale = 0;
    this.qcm_corrects = 0;
    this.qcm_done_faculte = {"FMT":0,"FMS":0,"FMM":0,"FMSo":0};
    this.qcm_done_annee = {"2020":0,"2019":0,"2018":0,"2017":0,"2016":0,"2015":0}
    this.quiz_done = 0;
    this.quiz_totale = 0;
    this.http.post<any[]>("http://localhost:8080/get_statistics",{"username":this.username}).subscribe(data => {
      this.qcm_done = data["qcm_done"];
      this.qcm_totale = data["qcm_totale"];
      this.qcm_corrects = data["qcm_corrects"];
      this.qcm_done_faculte = data["qcm_done_faculte"];
      this.qcm_done_annee = data["qcm_done_annee"];
      this.quiz_done = data["quiz_done"];
      this.quiz_totale = data["quiz_totale"];
    })

  }

  showCharts() {

    var data = google.visualization.arrayToDataTable([
      ['Essai', 'Temps en minutes'],
      ['1',  17],
      ['2',  25],
      ['3',  30],
      ['4',  5]
    ]);

    var options = {
      title: 'Title ...',
      curveType: 'function',
      legend: { position: 'bottom' },
      height: 400,
      vAxes: {
        // Adds titles to each axis.
        0: {title: 'Temps moyen / QCM (min)'}
      },
      hAxes: {
        // Adds titles to each axis.
        0: {title: 'Essai(s)'}
      },
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
  }


  showCharts2() {

    var data = google.visualization.arrayToDataTable([
      ['Essai', 'Précision'],
      ['1',  10],
      ['2',  40],
      ['3',  50],
      ['4',  95]
    ]);

    var options = {
      title: 'Title ...',
      curveType: 'function',
      legend: { position: 'bottom' },
      height: 400,
      vAxes: {
        // Adds titles to each axis.
        0: {title: 'Précision'}
      },
      hAxes: {
        // Adds titles to each axis.
        0: {title: 'Essai(s)'}
      },
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_divEVOLUTION'));

    chart.draw(data, options);
  }




  showCharts3() {
    var data = google.visualization.arrayToDataTable([
      // Here, axises are inverted % our logic
      ['Nombre de QCM faits', 'QCM faits', { role: 'style' } ],
      ['L', 10, 'color: #76A7FA'],
      ['M', 14, 'color: #76A7FA'],
      ['M', 16, 'color: #76A7FA'],
      ['J', 22, 'color: #76A7FA'],
      ['S', 28, 'stroke-color: #76A7FA'],
      ['D', 17, 'stroke-color: #76A7FA']
    ]);
    

    var options = {
      
      title: 'Title ... ',
      legend: { position: 'none' },
      height: 400,
      vAxes: {
        // Adds titles to each axis.
        0: {title: 'Nombre de QCM faits'}
      },
      hAxes: {
        // Adds titles to each axis.
        0: {title: 'Jours'}
      },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_moyenne_qcm_jour'));
    chart.draw(data, options);
  }
  

}
