import { Component, ViewChild, AfterViewInit } from '@angular/core';

import {NgJoystickComponent} from 'ng-joystick';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('joystick') joystickComp: NgJoystickComponent;

  ngAfterViewInit() {
    this.joystickComp.up$.subscribe(d => console.log('up', d));
    this.joystickComp.down$.subscribe(d => console.log('down', d));
    this.joystickComp.right$.subscribe(d => console.log('right', d));
    this.joystickComp.left$.subscribe(d => console.log('left', d));
  }
}
