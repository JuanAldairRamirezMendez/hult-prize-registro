import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Registro {
  id?: number;
  nombre?: string;
  email?: string;
  categoria?: string;
  created_at?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  date = new Date().getFullYear();
  registrationsCount = 0;
  last7Count = 0;
  last30Count = 0;
  percentChangeWeek = 0;
  recent: Registro[] = [];
  // Line chart inputs
  labels: string[] = [];
  lineDatasets: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadRegistrations();
  }

  private loadRegistrations() {
    this.http.get<any>('http://localhost:3000/registrations')
      .subscribe(res => {
        // backend returns { count, items } — accept that or a raw array
        const items: Registro[] = Array.isArray(res) ? res : (res && Array.isArray(res.items) ? res.items : []);
        if (!items || !Array.isArray(items)) {
          this.registrationsCount = 0;
          return;
        }
        this.registrationsCount = items.length;

        const now = new Date();
        const ms = (d: number) => 24 * 60 * 60 * 1000 * d;

        const last7From = new Date(now.getTime() - ms(7));
        const last30From = new Date(now.getTime() - ms(30));
        const last14From = new Date(now.getTime() - ms(14));

        const parseDate = (s?: string) => s ? new Date(s) : null;

        this.last7Count = items.filter(it => {
          const d = parseDate(it.created_at);
          return d && d >= last7From;
        }).length;

        this.last30Count = items.filter(it => {
          const d = parseDate(it.created_at);
          return d && d >= last30From;
        }).length;

        const prevWeekCount = items.filter(it => {
          const d = parseDate(it.created_at);
          return d && d >= last14From && d < last7From;
        }).length;

        if (prevWeekCount === 0) {
          this.percentChangeWeek = this.last7Count > 0 ? 100 : 0;
        } else {
          this.percentChangeWeek = Math.round(((this.last7Count - prevWeekCount) / prevWeekCount) * 100);
        }

        // recent registrations (sorted desc by date)
        this.recent = items
          .map(i => i)
          .filter(i => i.created_at)
          .sort((a, b) => (new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()))
          .slice(0, 5);

        // Build last 30 days labels and daily counts
        const days = 30;
        const labels: string[] = [];
        const countsMap: { [k: string]: number } = {};
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
          labels.push(key);
          countsMap[key] = 0;
        }

        items.forEach(it => {
          const d = parseDate(it.created_at);
          if (!d) return;
          const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
          if (countsMap.hasOwnProperty(key)) countsMap[key]++;
        });

        const dailyCounts = labels.map(l => countsMap[l] || 0);
        this.labels = labels.map(l => {
          // display as DD/MM for chart labels
          const p = l.split('-');
          return `${p[2]}/${p[1]}`;
        });
        this.lineDatasets = [
          {
            label: 'Registrations',
            backgroundColor: '#4c51bf',
            borderColor: '#4c51bf',
            data: dailyCounts,
            fill: false
          }
        ];
      }, err => {
        console.error('Failed to load registrations', err);
      });
  }

}
