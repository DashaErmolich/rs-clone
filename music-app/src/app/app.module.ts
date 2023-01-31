// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
// import { JsonpModule, Jsonp, Response } from '@angular/common/http';

// import AppComponent from './app.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import AppRoutingModule from './app-routing.module';

import AppComponent from './app.component';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientJsonpModule, AppRoutingModule, HttpClientModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export default class AppModule { }

// @NgModule({
//   declarations: [
//     AppComponent,
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     HttpClientModule,
//     HttpClientJsonpModule,
//     JsonpModule,
//     Jsonp,
//     Response
//   ],
//   providers: [],
//   bootstrap: [AppComponent],
// })
// export default class AppModule { }
