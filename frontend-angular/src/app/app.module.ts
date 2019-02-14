import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';


import { AppComponent } from './app.component';
import { LoginComponent } from "./componets/login.component";
import { BillingComponent } from "./componets/billing.component";

import { AppRoutingModule } from './app-routing.module';

import { Apisettings, APISETTINGS } from './appConfig';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BillingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
    { provide: LOCALE_ID,
      useValue: 'es'
    },
    Title,
    {
      provide: Apisettings,
      useValue: APISETTINGS
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
