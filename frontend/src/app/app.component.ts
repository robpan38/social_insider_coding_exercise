import { FetchBrandDataService } from './services/fetch-brand-data.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BrandData } from './models/brand-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Brand Compare Frontend';
  dataSource: BrandData[] = [];
  displayedColumns = ['brandname', 'profiles', 'totalFans', 'totalEngagement'];
  showTable = false;
  isLoading = false;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private fetchBrandData: FetchBrandDataService) { }

  ngOnInit() {
    this.range.valueChanges.subscribe(currentRange => {
      let {start, end} = currentRange;
      if (start && end) {
        this.showTable = false;
        this.isLoading = true;

        this.fetchBrandData.getBrandData(
          Date.UTC(start.getFullYear(), start.getMonth(), start.getDay(), 2, 0, 0),
          Date.UTC(end.getFullYear(), end.getMonth(), end.getDay(), 2, 0, 0),
          "Europe/Bucharest"
        ).subscribe((data: BrandData[]) => {
          this.dataSource = data;
          this.isLoading = false;
          this.showTable = true;
        })
      }
    })
  }
}
