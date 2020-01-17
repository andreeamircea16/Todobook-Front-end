import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Category} from "../models.model";
import {NetworkingService} from "../networking.service";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private networkingService: NetworkingService) {
  }

  ngOnInit() {
    this.networkingService.getCategories().subscribe((response: any) => {
      this.categories = response.data;
      console.log(this.categories);
    });
  }

  categories: Category[] = [];

  closeSidemenu() {
    this.close.emit();
  }
}
