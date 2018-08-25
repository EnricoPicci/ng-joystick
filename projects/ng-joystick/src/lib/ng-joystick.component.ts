import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, Inject, Renderer2, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';
import { map, switchMap, takeUntil, tap, publishReplay, refCount, filter, take, distinctUntilChanged } from 'rxjs/operators';
import { merge } from 'rxjs';

import {distance, angle, findCoord, radians} from './ng-joystick-utils';

export interface JoystickEvent {
    pointerPos: {
        x: any;
        y: any;
    };
    clampedPos: {
        x: number;
        y: number;
    };
    force: number;
    pressure: any;
    distance: number;
    angle: {
        radian: number;
        degree: number;
    };
    direction: any;
}

// such constants are calculated once for all
const angle45 = Math.PI / 4;
const angle90 = Math.PI / 2;

@Component({
  selector: 'njk-joystick',
  template: `
    <div id="zone_joystick">
      <div class="joystickPad" #joystickPad
          [style.left]="position.left" [style.top]="position.top">
          <div class="back"></div>
          <div class="front" #joystickHandle></div>
      </div>
    </div>
  `,
  styleUrls: ['./ng-joystick.component.css']
})
export class NgJoystickComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() position: {left: string, top: string};
  private startPosition: {x: number, y: number};
  @Input() size = 100;
  maxDist = this.size / 2;
  @Input() threshold = 0.1;
  @ViewChild('joystickPad') private joystickPadElement: ElementRef;
  @ViewChild('joystickHandle') private handleElement: ElementRef;
  private handleNativeElement;

  private move$: Observable<any>;
  private end$: Observable<any>;

  private joystickMoveSubscription: Subscription;

  private directionX$ = new Subject<any>();
  private directionY$ = new Subject<any>();
  private directionAngular$ = new Subject<any>();

  // APIs
  joystickStart$: Observable<any>;
  joystickMove$: Observable<JoystickEvent>;
  joystickRelease$: Observable<JoystickEvent>;
  up$: Observable<any>;
  down$: Observable<any>;
  right$: Observable<any>;
  left$: Observable<any>;
  planDirX$ = this.directionX$.asObservable();
  planDirY$ = this.directionY$.asObservable();

  constructor(@Inject(DOCUMENT) private document: any, private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.startPosition = {
        x: parseInt(this.position.left, 10),
        y: parseInt(this.position.top, 10),
    };
    this.handleNativeElement = this.handleElement.nativeElement;
    this.joystickStart$ = merge(
        this.buildStream(this.joystickPadElement.nativeElement, 'pointerdown'),
        this.buildStream(this.joystickPadElement.nativeElement, 'mousedown'),
        this.buildStream(this.joystickPadElement.nativeElement, 'touchstart'),
    );
    this.end$ = merge(
        this.buildStream(this.document, 'pointerup'),
        this.buildStream(this.document, 'pointercancel'),
        this.buildStream(this.document, 'mouseup'),
        this.buildStream(this.document, 'touchend'),
        this.buildStream(this.document, 'touchcancel'),
    );
    this.move$ = merge(
        this.buildStream(this.document, 'pointermove'),
        this.buildStream(this.document, 'mousemove'),
        this.buildStream(this.document, 'touchmove'),
    );

    this.joystickMove$ = this.buildJoystickMove();
    this.joystickRelease$ = this.buildJoystickRelease();

    // we need to subscribe since it is joystickMove$ Observable which controls the position
    // of the joystick on the UI
    this.joystickMoveSubscription = this.joystickMove$.subscribe();

    this.up$ = this.directionAngular$.pipe(distinctUntilChanged(), filter(d => d === 'up'));
    this.down$ = this.directionAngular$.pipe(distinctUntilChanged(), filter(d => d === 'down'));
    this.right$ = this.directionAngular$.pipe(distinctUntilChanged(), filter(d => d === 'right'));
    this.left$ = this.directionAngular$.pipe(distinctUntilChanged(), filter(d => d === 'left'));

    // console.log('this.joystickPadElement', this.joystickPadElement);
  }

  ngOnDestroy() {
    this.joystickMoveSubscription.unsubscribe();
  }

  private buildStream(element, eventName: string) {
    return fromEvent(element, eventName)
    .pipe(
        // tap(console.log),
        map(event => this.prepareEvent(event)),
    );
  }

  // 'publishReplay' and 'refCount' ensure that there is only one subscription running
  // which means that `setHandlePosition` is run only once independently on how many clients
  // subscribe to this Observable
  private buildJoystickMove() {
    return this.joystickStart$
    .pipe(
        tap(() => this.handlePressed()),
        switchMap(
            () => this.move$
                .pipe(
                    takeUntil(this.end$
                        .pipe(
                            tap(() => this.handleReleased())
                        )
                    ),
                )
        ),
        map(event => this.buildJoystickEvent(event)),
        tap(event => this.setHandlePosition(event.clampedPos)),
        publishReplay(1),
        refCount(),
    );
  }
  private buildJoystickRelease() {
    return this.joystickStart$
    .pipe(
        switchMap(() => this.end$.pipe(take(1))),
        map(event => this.buildJoystickEvent(event)),
    );
  }

  private prepareEvent(event) {
    event.preventDefault();
    return event.type.match(/^touch/) ? event.changedTouches.item(0) : event;
  }

  private buildJoystickEvent(event) {
    const pointerPos = {
        x: event.clientX,
        y: event.clientY
    };
    let clampedPos: {
        x: number,
        y: number
    };

    let dist = distance(pointerPos, this.startPosition);
    const eventAngle = angle(pointerPos, this.startPosition);

    // If distance is bigger than joystick's size
    // we clamp the position.
    if (dist > this.maxDist) {
        dist = this.maxDist;
        clampedPos = findCoord(this.startPosition, dist, eventAngle);
    } else {
        clampedPos = pointerPos;
    }

    const force = dist / this.size;
    const rAngle = radians(180 - eventAngle);
    // Compute the direction's datas.
    let direction;
    if (force > this.threshold) {
        direction = this.computeDirection(rAngle);
    }

    // Prepare event's data.
    const moveEvent: JoystickEvent = {
        pointerPos,
        clampedPos,
        force,
        pressure: event.force || event.pressure || event.webkitForce || 0,
        distance: dist,
        angle: {
            radian: rAngle,
            degree: 180 - eventAngle
        },
        direction
    };

    return moveEvent;
  }

  private setHandlePosition(clampedPos) {
    const xPosition = Math.round((clampedPos.x - this.startPosition.x) * 100) / 100 + 'px';
    const yPosition = Math.round((clampedPos.y - this.startPosition.y) * 100) / 100 + 'px';

    this.renderer.setStyle(this.handleNativeElement, 'left', xPosition);
    this.renderer.setStyle(this.handleNativeElement, 'top', yPosition);
  }

  private computeDirection(radianAngle) {
    let direction, directionX, directionY;

    // Angular direction
    //     \  UP /
    //      \   /
    // LEFT       RIGHT
    //      /   \
    //     /DOWN \
    //
    if (
        radianAngle > angle45 &&
        radianAngle < (angle45 * 3)
    ) {
        direction = 'up';
    } else if (
        // radianAngle > -angle45 &&
        radianAngle > (angle45 * 3) &&
        radianAngle <= (angle45 * 5)
    ) {
        direction = 'left';
    } else if (
        radianAngle > (angle45 * 5) &&
        radianAngle <= (angle45 * 7)
    ) {
        direction = 'down';
    } else {
        direction = 'right';
    }

    // Plain direction
    //    UP                 |
    // _______               | RIGHT
    //                  LEFT |
    //   DOWN                |
    if (radianAngle > angle90 && radianAngle < (angle90 * 3)) {
        directionX = 'left';
    } else {
        directionX = 'right';
    }

    if (radianAngle < (angle90 * 2)) {
        directionY = 'up';
    } else {
        directionY = 'down';
    }

    const newDirectionInfo = {dirX: directionX, dirY: directionY, angularDir: direction};

    this.directionX$.next(newDirectionInfo.dirX);
    this.directionY$.next(newDirectionInfo.dirY);
    this.directionAngular$.next(newDirectionInfo.angularDir);

    return newDirectionInfo;
  }

  private handlePressed() {
    this.renderer.removeStyle(this.handleNativeElement, 'transition');
  }

  private handleReleased() {
    this.renderer.setStyle(this.handleNativeElement, 'transition', 'top 250ms, left 250ms');
    this.renderer.setStyle(this.handleNativeElement, 'left', '0px');
    this.renderer.setStyle(this.handleNativeElement, 'top', '0px');
  }

}

