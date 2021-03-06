import {Component, OnInit} from '@angular/core';

export interface OnCountdownTimerFinished {
  countdownTimerFinished(finishedCountdownTimer: CountdownTimer): void;
}

export class CountdownTimer {
  public isRunning: boolean = false;
  public isVisible: boolean = true;
  public howManyMinutes: number;
  public currentMinutes: number;
  public currentSeconds: number;
  private currentMilliseconds: number;
  private onFinish: OnCountdownTimerFinished;

  constructor(howManyMinutes: number, onFinish: OnCountdownTimerFinished) {
    this.howManyMinutes = howManyMinutes;
    this.onFinish = onFinish;
  }

  public startRunning(howManyMinutes: number) {
    if (this.howManyMinutes == howManyMinutes) {
      this.isRunning = true;
      this.currentMilliseconds = this.howManyMinutes * 60 * 1000;
      this.nextCountdown();
    } else {
      this.isVisible = false;
    }
  }

  public isHidden(): boolean {
    return !this.isVisible;
  }

  private nextCountdown() {
    this.currentMilliseconds -= 1000;
    this.updateMinutesAndSeconds();
    if (this.currentMilliseconds > 0) {
      setTimeout(() => this.nextCountdown(), 1000);
    } else {
      this.onFinish.countdownTimerFinished(this);
    }
  }

  public reset() {
    this.isRunning = false;
    this.isVisible = true;
  }

  private updateMinutesAndSeconds() {
    this.currentMinutes = Math.floor((this.currentMilliseconds / 1000) / 60);
    this.currentSeconds = (this.currentMilliseconds / 1000) % 60;
  }

}


@Component({
  selector: 'countdown-timers',
  templateUrl: './countdown-timers.component.html',
  styleUrls: ['./countdown-timers.component.css']
})
export class CountdownTimersComponent implements OnInit, OnCountdownTimerFinished {
  private countdownTimers: Array<CountdownTimer>;

  constructor() {
    this.countdownTimers = [
      new CountdownTimer(15, this),
      new CountdownTimer(30, this),
      new CountdownTimer(45, this),
      new CountdownTimer(60, this)
    ];
  }

  public countdownTimerFinished(finishedCountdownTimer: CountdownTimer) {
    this.countdownTimers.forEach((countdownTimer: CountdownTimer) => countdownTimer.reset());
  }

  ngOnInit() {
  }

  public startCountdownTimer(countdownTimerToStart: CountdownTimer) {
    this.countdownTimers.forEach((countdownTimer: CountdownTimer) => countdownTimer.startRunning(countdownTimerToStart.howManyMinutes));
  }

}
