[![Build Status](https://travis-ci.org/EnricoPicci/ng-joystick.svg?branch=master)](https://travis-ci.org/EnricoPicci/ng-joystick)


[![Coverage Status](https://coveralls.io/repos/github/EnricoPicci/ng-joystick/badge.svg?branch=master)](https://coveralls.io/github/EnricoPicci/ng-joystick?branch=master)


# Input APIs
There some input properties offered as APIs which can be set as properties when using the component
* @Input() position: {left: string, top: string};
position is to be used to set the position of the ng-joystick component within the container which contains it
* @Input() size = 100;
The size of the joystick
* @Input() threshold = 0.1;
The minimal distance from previous point that the pointer/mouse has to have in order for a 'movement event' to be fired


# Output APIs
Some Observables are exposed as public APIs to the user of this component.
Such Observables emit different movement related events which the user of the component may be interested in
* joystickStart$ - emits when the pointer/mouse is clicked on the joystick handle to start the movement of the joystick
* joystickMove$: Observable<JoystickEvent> - emits every movement of the joystick handle with the details of the point the handle moved to;
* joystickRelease$: Observable<JoystickEvent> - emits when the pointer/mouse is released after have dragged the joystick handle with the details of the point where the pointer/mouse has been released
* up$ - emits if the movement direction is up
* down$ - emits if the movement direction is down
* right$ - emits if the movement direction is right;
* left$ - emits if the movement direction is left;
* planDirX$ - emits 'right' or 'left' if the horizontal movement is right or left;
* planDirY$ - emits 'up' or 'down' if the vertical movement is up or down;


# NgJoystickApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.


### Build the Library
ng build --prod ng-joystick

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


