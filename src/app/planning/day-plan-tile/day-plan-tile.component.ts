import {Component, OnInit, Input, Inject, Output, EventEmitter} from '@angular/core';
import {Day} from '../../task/task';
import {EventBusService} from '../../event-bus/event-bus.service';
import {TaskService, TaskServiceToken} from '../../execute-plan/focused-task/task.service';
import {Router} from '@angular/router';
import {TimeProviderToken, TimeProvider} from '../../time-provider/time-provider';

export interface CopyTaskEvent {
  dayIndex: number;
  taskIndex: number;
}
export interface CopyNotDoneTasksEvent {
  dayIndex: number;
}

@Component({
  selector: 'day-plan-tile',
  templateUrl: './day-plan-tile.component.html',
  styleUrls: ['./day-plan-tile.component.css']
})
export class DayPlanTileComponent implements OnInit {
  @Input() public day: Day;
  @Input() public dayIndex: number;
  @Input() public isShowingFutureDay: boolean;
  @Output() public copyTask: EventEmitter<CopyTaskEvent> = new EventEmitter<CopyTaskEvent>();
  @Output() public copyNotDoneTasks: EventEmitter<CopyNotDoneTasksEvent> = new EventEmitter<CopyNotDoneTasksEvent>();

  private eventBus: EventBusService;
  private taskService: TaskService;
  private router: Router;
  private timeProvider: TimeProvider;
  private timeline: string = null;
  private isShowingQuestion: boolean = false;

  constructor(eventBus: EventBusService, @Inject(TaskServiceToken) taskService: TaskService, router: Router, @Inject(TimeProviderToken) timeProvider: TimeProvider) {
    this.eventBus = eventBus;
    this.taskService = taskService;
    this.router = router;
    this.timeProvider = timeProvider;
  }

  ngOnInit() {
  }

  public goToExecuteDay(day: Day) {
    this.eventBus.focusedDaySubject.next(day, 'DayPlanTileComponent.goToExecuteDay');
    this.taskService.saveDay(this.day, () => {
      this.router.navigateByUrl('/executeplan');
    });
  }

  public addTaskFromDraft(day: Day) {
    day.addTaskFromDraft();
    this.saveDay();
  }

  public saveDay() {
    this.taskService.saveDay(this.day, () => {
    });
  }

  public clearTasks(day: Day) {
    day.clearTasks();
    this.saveDay();
    this.hideQuestion();
  }

  public sortTasks(day: Day) {
    day.sortTasksByValue();
    this.saveDay();
  }

  public removeTask(taskIndexZeroBased: number) {
    this.day.removeTask(taskIndexZeroBased);
    this.saveDay();
  }

  public editTask(taskIndexZeroBased: number) {
    this.eventBus.focusTaskInputSubject.next(taskIndexZeroBased);
  }

  public moveTaskDown(taskIndexZeroBased: number) {
    this.day.moveTaskDown(taskIndexZeroBased);
    this.saveDay();
  }

  public moveTaskUp(taskIndexZeroBased: number) {
    this.day.moveTaskUp(taskIndexZeroBased);
    this.saveDay();
  }

  public copyTaskToNextDay(taskIndex: number) {
    this.copyTask.emit({dayIndex: this.dayIndex, taskIndex: taskIndex});
  }

  public copyNotDoneTasksToNextDay() {
    this.copyNotDoneTasks.emit({dayIndex: this.dayIndex});
  }

  private getCurrentDayWithoutMinutesTime(): number {
    return new Date(new Date(this.timeProvider.getTime()).toISOString().slice(0, 10)).getTime();
  }

  public getTimeline(): string {
    if (this.timeline == null) {
      this.timeline = 'current';
      let differenceBetweenNowAndDay = this.getCurrentDayWithoutMinutesTime() - this.day.date.getTime();
      if (differenceBetweenNowAndDay < 0) {
        this.timeline = 'future';
      } else if (differenceBetweenNowAndDay > 0) {
        this.timeline = 'past';
      }
    }
    return this.timeline;
  }

  public isDayInThePast(): boolean {
    return this.getTimeline() == 'past';
  }

  public isDayCurrent(): boolean {
    return this.getTimeline() == 'current';
  }

  public isDayCurrentOrPast(): boolean {
    return this.getTimeline() != 'future';
  }

  public isDayVisible(): boolean {
    return this.day && (this.isShowingFutureDay || this.isDayCurrentOrPast());
  }

  public showQuestion() {
    this.isShowingQuestion = true;
  }

  public hideQuestion() {
    this.isShowingQuestion = false;
  }


}
