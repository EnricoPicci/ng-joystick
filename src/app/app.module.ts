import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgJoystickModule} from 'ng-joystick';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgJoystickModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
