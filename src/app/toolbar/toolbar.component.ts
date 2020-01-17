import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnChanges, OnDestroy {
  @Input() homeRoute: string;
  @Input() hasAccount: boolean;

  @ViewChild('menuContainer') menuContainer: ElementRef;

  user;
  userName: string;
  menuIsOpen: boolean = false;

  constructor(private authenticationService: AuthenticationService) {
    this.closeMenuOnOutsideClick = this.closeMenuOnOutsideClick.bind(this);
  }

  private static nodeIsDescendant(ancestor: HTMLElement, event: any) { // Kind of sort of polyfill
    if (!event) {
      return true;
    }

    if (event.composedPath) {
      return (event.composedPath().includes(ancestor));
    }
    if (event.deepPath) {
      return (event.deepPath().includes(ancestor));
    }

    let node = event.target.parentNode;
    while (node !== null) {
      if (node === ancestor) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  private closeMenuOnOutsideClick(event) {
    if (!ToolbarComponent.nodeIsDescendant(this.menuContainer.nativeElement, event)) {
      this.closeMenu();
    }
  }

  logout() {
    this.authenticationService.logout();
  }

  openMenu() {
    this.menuIsOpen = true;
    window.requestAnimationFrame(() => {
      window.addEventListener('click', this.closeMenuOnOutsideClick);
    });
  }

  closeMenu() {
    window.removeEventListener('click', this.closeMenuOnOutsideClick);
    this.menuIsOpen = false;
  }

  toggleMenu() {
    if (this.menuIsOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasAccount.currentValue) {
      this.authenticationService.getAccountDetails$();
      this.authenticationService.currentUserSubject.subscribe(
        user => {
          this.user = user;
          this.userName = this.user ? this.user.first_name + ' ' + this.user.last_name : '';
        }
      );
    }
  }

  ngOnDestroy() {
    window.removeEventListener('click', this.closeMenuOnOutsideClick);
  }
}
