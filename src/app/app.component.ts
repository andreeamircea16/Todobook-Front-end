import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import 'rxjs-compat/add/operator/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  homeRoute = '/';
  userName = '';
  hasAccount = true;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((event: NavigationStart) => {
        if (event.url === '/login') {
          this.homeRoute = '/login';
          this.hasAccount = false;
        } else {
          this.homeRoute = '/';
          this.hasAccount = true;
        }
      });
  }
}
