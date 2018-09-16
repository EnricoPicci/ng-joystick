import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NgJoystickModule, JoystickEvent} from 'ng-joystick';

describe('AppComponent', () => {
  // let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let joystickPad: DebugElement;
  let joystickHandle: DebugElement;

  const initialJoystickPosX = 500;
  const initialJoystickPosY = 300;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgJoystickModule ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    // component = fixture.componentInstance;
    app = fixture.debugElement.componentInstance;
    joystickPad = fixture.debugElement.query(By.css('.joystickPad'));
    joystickHandle = fixture.debugElement.query(By.css('.front'));
    fixture.detectChanges();
  });

  it('1 - should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it('2 - should create the joystick', async(() => {
    expect(app.joystickComp).toBeTruthy();
  }));

  it(`3 - should create the joystick and its handle`, async(() => {
    expect(joystickPad).toBeTruthy();
    expect(joystickHandle).toBeTruthy();
  }));

  it(`4 - clicks on the joystick handle and the relative Observable emits`, async(() => {
    let startClick;
    app.joystickComp.joystickStart$
    .subscribe(
      event => startClick = event
    );
    // events fired for the test
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: 1}));
    }, 100);
    // conditions checked
    setTimeout(() => {
      expect(startClick).toBeTruthy();
    }, 1000);

  }));

  it(`5 - release the pointer the relative Observable emits`, async(() => {
    let pointerUp;
    app.joystickComp.joystickRelease$
    .subscribe(
      event => pointerUp = event
    );

    let timeOffsetForTest: number;
    // ==========   TEST 5.1  ===============
    // pointerup before pointerdown
    timeOffsetForTest = 0;
    // EVENTS FIRED
    // a pointerup event is fired before the joystick is activated (i.e. before the pointerdown event)
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      document.dispatchEvent(new PointerEvent('pointerup', {
        pointerId: 1
       }));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the pointerup event is undefined since joystickRelease$ does not emit
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(pointerUp).toBeUndefined();
    }, timeOffsetForTest);

    // ==========   TEST 5.2  ===============
    // pointerup after pointerdown
    timeOffsetForTest = 100;
    // EVENTS FIRED
    // a pointerdown event is fired
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: 1
       }));
    }, timeOffsetForTest);
    // a pointerup event is fired
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      document.dispatchEvent(new PointerEvent('pointerup', {
        pointerId: 1
       }));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the pointerup event is defined since joystickRelease$ has to emit
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(pointerUp).toBeDefined();
    }, timeOffsetForTest);

    // ==========   TEST 5.3  ===============
    // pointerup after pointerdown, then pointer down outside the joystick handle and then pointerup
    timeOffsetForTest = 200;
    // EVENTS FIRED
    // a pointerdown event is fired
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: 1
       }));
    }, timeOffsetForTest);
    // a pointerup event is fired
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      document.dispatchEvent(new PointerEvent('pointerup', {
        pointerId: 1
       }));
    }, timeOffsetForTest);
    // a pointerdown event is fired OUTSIDE THE JOYSTICK HANDLE so that the joystick is not activated
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      document.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: 1
       }));
    }, timeOffsetForTest);
    // a pointerup event is fired
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      // pointerup is reset to undefined
      pointerUp = undefined;
      document.dispatchEvent(new PointerEvent('pointerup', {
        pointerId: 1
       }));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the pointerup event is undefined since joystickRelease$ has not to emit the second time the pointer is UP
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(pointerUp).toBeUndefined();
    }, timeOffsetForTest);

  }));

  it(`6 - moved the pointer before and after having activated the joystick clicking on the joystick handle,
     and after the pointer has been released
     test if the relative Observable emits as expected`, async(() => {
    let joystickEvent: JoystickEvent;
    let posX: number;
    let posY: number;
    app.joystickComp.joystickMove$
    .subscribe(
      event => joystickEvent = event
    );

    let timeOffsetForTest: number;
    // ==========   TEST 6.1  ===============
    // pointermove before pointerdown
    timeOffsetForTest = 0;
    // EVENTS FIRED
    // a pointermove event is fired before the joystick is activated (i.e. before the pointerdown event)
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      document.dispatchEvent(new PointerEvent('pointermove', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: 250,
        clientY: 450
       }));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the joystickevent is undefined
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(joystickEvent).toBeUndefined();
    }, timeOffsetForTest);

    // ==========   TEST 6.2  ===============
    // pointermove after pointerdown
    timeOffsetForTest = 100;
    posX = 250;
    posY = 450;
    // EVENTS FIRED
    // click on the joystick handle to activate the joystick
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointerdown'));
    }, timeOffsetForTest);
    // a pointermove event is fired after the joystick is activated
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointermove', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: posX,
        clientY: posY
       }));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the joystick event is correct
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(joystickEvent.pointerPos.x).toBe(posX);
      expect(joystickEvent.pointerPos.y).toBe(posY);
    }, timeOffsetForTest);

    // ==========   TEST 6.3  ===============
    // pointermove after pointerup
    timeOffsetForTest = 200;
    posX = 150;
    posY = 50;
    // EVENTS FIRED
    // click on the joystick handle to activate the joystick
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: 1
      }));
    }, timeOffsetForTest);
    // a pointermove event is fired after the joystick is activated
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointermove', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: posX,
        clientY: posY
       }));
    }, timeOffsetForTest);
    // release the pointer
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      document.dispatchEvent(new PointerEvent('pointerup', {
        pointerId: 1
      }));
    }, timeOffsetForTest);
    // a pointermove event is fired after the joystick is activated
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointermove', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: posX + 1,
        clientY: posY + 1
       }));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the joystick event has the postion of the last pointermove event before releasing the pointer with pointerup
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(joystickEvent.pointerPos.x).toBe(posX);
      expect(joystickEvent.pointerPos.y).toBe(posY);
    }, timeOffsetForTest);

  }));

  it(`7 - move the pointer and make sure that up$,down$, right$, left$, planDirX$, planDirY$
        Observables emit correctly`, async(() => {
    let pointerEventInit: PointerEventInit;
    let upEvent;
    let downEvent;
    let rightEvent;
    let letfEvent;
    let planDirXEvent;
    let planDirYEvent;
    app.joystickComp.up$.subscribe(event => upEvent = event);
    app.joystickComp.down$.subscribe(event => downEvent = event);
    app.joystickComp.right$.subscribe(event => rightEvent = event);
    app.joystickComp.left$.subscribe(event => letfEvent = event);
    app.joystickComp.planDirX$.subscribe(event => planDirXEvent = event);
    app.joystickComp.planDirY$.subscribe(event => planDirYEvent = event);

    let timeOffsetForTest: number;
    // a pointerdown event is fired to activate the joystick
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: 1
       }));
    }, timeOffsetForTest);

    // ==========   TEST 7.1  ===============
    // pointermove in the "up" direction
    timeOffsetForTest = 0;
    // EVENTS FIRED
    // a pointermove event in the "up quadrant" above the center of the joystik
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      upEvent = downEvent = rightEvent = letfEvent = planDirXEvent = planDirYEvent = null;
      pointerEventInit = {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: initialJoystickPosX,
        clientY: initialJoystickPosY - 100,
      };
      document.dispatchEvent(new PointerEvent('pointermove', pointerEventInit));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the pointerup event is undefined since joystickRelease$ does not emit
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(upEvent).toBeTruthy();
      expect(downEvent || rightEvent || letfEvent).toBeFalsy();
      expect(planDirXEvent).toBe('right');
      expect(planDirYEvent).toBe('up');
    }, timeOffsetForTest);

    // ==========   TEST 7.2  ===============
    // pointermove in the "down" direction
    timeOffsetForTest = 100;
    // EVENTS FIRED
    // a pointermove event in the "up quadrant" above the center of the joystik
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      upEvent = downEvent = rightEvent = letfEvent = planDirXEvent = planDirYEvent = null;
      pointerEventInit = {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: initialJoystickPosX,
        clientY: initialJoystickPosY + 100,
      };
      document.dispatchEvent(new PointerEvent('pointermove', pointerEventInit));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the pointerup event is undefined since joystickRelease$ does not emit
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(downEvent).toBeTruthy();
      expect(upEvent || rightEvent || letfEvent).toBeFalsy();
      expect(planDirXEvent).toBe('right');
      expect(planDirYEvent).toBe('down');
    }, timeOffsetForTest);

    // ==========   TEST 7.3  ===============
    // pointermove in the "right" direction
    timeOffsetForTest = 200;
    // EVENTS FIRED
    // a pointermove event in the "up quadrant" above the center of the joystik
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      upEvent = downEvent = rightEvent = letfEvent = planDirXEvent = planDirYEvent = null;
      pointerEventInit = {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: initialJoystickPosX + 100,
        clientY: initialJoystickPosY,
      };
      document.dispatchEvent(new PointerEvent('pointermove', pointerEventInit));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the pointerup event is undefined since joystickRelease$ does not emit
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(rightEvent).toBeTruthy();
      expect(upEvent || downEvent || letfEvent).toBeFalsy();
      expect(planDirXEvent).toBe('right');
      expect(planDirYEvent).toBe('up');
    }, timeOffsetForTest);

    // ==========   TEST 7.4  ===============
    // pointermove in the "left" direction
    timeOffsetForTest = 300;
    // EVENTS FIRED
    // a pointermove event in the "up quadrant" above the center of the joystik
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      upEvent = downEvent = rightEvent = letfEvent = planDirXEvent = planDirYEvent = null;
      pointerEventInit = {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: initialJoystickPosX - 100,
        clientY: initialJoystickPosY,
      };
      document.dispatchEvent(new PointerEvent('pointermove', pointerEventInit));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the pointerup event is undefined since joystickRelease$ does not emit
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(letfEvent).toBeTruthy();
      expect(upEvent || downEvent || rightEvent).toBeFalsy();
      expect(planDirXEvent).toBe('left');
      expect(planDirYEvent).toBe('down');
    }, timeOffsetForTest);

  }));

  it(`8 - move the pointer and check that the position of the joystick handle is updated accordingly`, async(() => {
    let pointerEventInit: PointerEventInit;
    const offsetLeft = joystickHandle.nativeElement.offsetLeft;
    const offsetTop = joystickHandle.nativeElement.offsetTop;
    let moveLeft: number;
    let moveTop: number;

    let timeOffsetForTest: number;

    // ==========   TEST 8.1  ===============
    // pointer moves to a position inside the area of the joystick
    timeOffsetForTest = 0;
    // EVENTS FIRED
    // a pointerdown event is fired to activate the joystick
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      joystickPad.nativeElement.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: 1
       }));
    }, timeOffsetForTest);
    // a pointermove event is fired within the area of the joystick
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      moveLeft = 1;
      moveTop = 2;
      pointerEventInit = {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: initialJoystickPosX + moveLeft,
        clientY: initialJoystickPosY + moveTop,
      };
      document.dispatchEvent(new PointerEvent('pointermove', pointerEventInit));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the offset of the joystick handle is changed
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(joystickHandle.nativeElement.offsetLeft).toBe(offsetLeft + moveLeft);
      expect(joystickHandle.nativeElement.offsetTop).toBe(offsetLeft + moveTop);
    }, timeOffsetForTest);

    // ==========   TEST 8.2  ===============
    // pointer moves to a position outside the area of the joystick - the position of the joystick handle is clamped
    timeOffsetForTest = 100;
    // EVENTS FIRED
    // a pointermove event is fired outside the area of the joystick
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      moveLeft = 301;
      moveTop = 302;
      pointerEventInit = {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        width: 1,
        height: 1,
        clientX: initialJoystickPosX + moveLeft,
        clientY: initialJoystickPosY + moveTop,
      };
      document.dispatchEvent(new PointerEvent('pointermove', pointerEventInit));
    }, timeOffsetForTest);
    // CONDITION CHECKED
    // the offset of the joystick handle is set to 10 since it is clamped
    timeOffsetForTest = timeOffsetForTest + 10;
    setTimeout(() => {
      expect(joystickHandle.nativeElement.offsetLeft).toBe(10);
      expect(joystickHandle.nativeElement.offsetTop).toBe(10);
    }, timeOffsetForTest);

  }));

});
