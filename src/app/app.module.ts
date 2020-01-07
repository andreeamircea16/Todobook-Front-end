import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {LoginComponent} from "./login/login.component";
import {HomepageComponent} from "./homepage/homepage.component";
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";

const appRoutes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: '',
  // },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HomepageComponent,
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LoginComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
