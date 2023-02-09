import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ActivatedRoute, NavigationStart, Router,
} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchControl!: FormControl;

  isSearchRoute: boolean = false;

  searchValue!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.searchControl = new FormControl();
    this.route.queryParams.subscribe((param) => this.searchControl.setValue(param['q']));
    this.searchControl.valueChanges.subscribe((res) => {
      this.searchValue = res;
      this.router.navigate(['music/search'], { queryParams: { q: this.searchValue } });
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const { url } = event;

        if (url.includes('/music/search')) {
          this.isSearchRoute = true;
        } else {
          this.isSearchRoute = false;
        }
      }
    });
  }
}
