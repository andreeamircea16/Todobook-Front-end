import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {LoginComponent} from "./login/login.component";
import {HomepageComponent} from "./homepage/homepage.component";
import {RouterModule, Routes} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {LoginActivate} from "./login-activate";
import {AuthGuardService} from "./auth-guard.service";
import {RequestInterceptor} from "./request.interceptor";
import {BookPageComponent} from "./book-page/book-page.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MyAccountComponent} from "./my-account/my-account.component";
import {SideMenuComponent} from "./side-menu/side-menu.component";
import {CategoryPageComponent} from "./category-page/category-page.component";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginActivate]
  },
  {
    path: '',
    pathMatch: 'full',
    component: HomepageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'book/:id',
    component: BookPageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'category/:id',
    component: CategoryPageComponent,
    canActivate: [AuthGuardService]
  }

];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LoginComponent,
    HomepageComponent,
    BookPageComponent,
    MyAccountComponent,
    SideMenuComponent,
    CategoryPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
