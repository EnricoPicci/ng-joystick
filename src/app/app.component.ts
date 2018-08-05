import { Component, ViewChild } from '@angular/core';

import {NgJoystickComponent} from 'ng-joystick';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('joystick') joystickComp: NgJoystickComponent;
}
