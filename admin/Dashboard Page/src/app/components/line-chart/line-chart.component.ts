import { Component, OnInit, AfterViewInit, OnChanges, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import Chart from "chart.js";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html'
})
export class LineChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() labels: string[] = [];
  @Input() datasets: any[] = [];
  @ViewChild('lineCanvas') lineCanvas!: ElementRef;

  chart: any = null;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && (changes.labels || changes.datasets)) {
      this.renderChart();
    }
  }

  renderChart() {
    try {
      const ctxEl: any = this.lineCanvas && this.lineCanvas.nativeElement ? this.lineCanvas.nativeElement.getContext('2d') : (document.getElementById('line-chart') as any).getContext('2d');
      if (this.chart) {
        this.chart.destroy();
      }
      const config: any = {
        type: 'line',
        data: {
          labels: this.labels && this.labels.length ? this.labels : [],
          datasets: this.datasets && this.datasets.length ? this.datasets : []
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: { display: false },
          legend: { align: 'end', position: 'bottom' },
          tooltips: { mode: 'index', intersect: false },
          hover: { mode: 'nearest', intersect: true },
          scales: {
            xAxes: [{ display: true }],
            yAxes: [{ display: true }]
          }
        }
      };
      this.chart = new Chart(ctxEl, config);
    } catch (err) {
      console.error('Error rendering line chart', err);
    }
  }

}
