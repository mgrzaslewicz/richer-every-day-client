import {Component, OnInit, Inject, QueryList, ViewChildren} from '@angular/core';
import {DayList} from '../task/task';
import {EventBusService} from '../event-bus';
import {TaskService, TaskServiceToken} from '../execute-plan/focused-task/task.service';
import {Router} from '@angular/router';
import {CopyTaskEvent, CopyNotDoneTasksEvent, DayPlanTileComponent} from './day-plan-tile/day-plan-tile.component';

@Component({
  selector: ' planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

  @ViewChildren('dayComponents') dayComponents: QueryList<DayPlanTileComponent>;
  private eventBus: EventBusService;
  private dayList: DayList;
  private isShowingFutureDays: boolean = false;
  private taskService: TaskService;
  private router: Router;

  constructor(eventBus: EventBusService, @Inject(TaskServiceToken) taskService: TaskService, router: Router) {
    this.eventBus = eventBus;
    this.taskService = taskService;
    this.router = router;
  }

  ngOnInit() {
    this.taskService.getDayList((dayList: DayList) => this.setDayList(dayList));
  }

  private setDayList(dayList: DayList) {
    this.dayList = dayList;
  }

  public saveDays() {
    this.taskService.saveDays(this.dayList.getDays(), () => {
    });
  }

  public copyTaskToNextDayInTheFuture(copyTaskEvent: CopyTaskEvent) {
    if (copyTaskEvent.dayIndex > 0) {
      this.dayList.copyTaskToNextDayInTheFuture(copyTaskEvent.dayIndex, copyTaskEvent.taskIndex);
    }
    this.saveDays();
  }

  public copyNotDoneTasksToNextDayInTheFuture(copyNotDoneTasksEvent: CopyNotDoneTasksEvent) {
    if (copyNotDoneTasksEvent.dayIndex > 0) {
      this.dayList.copyNotDoneTasksToNextDayInTheFuture(copyNotDoneTasksEvent.dayIndex);
    }
    this.saveDays();
  }

  public showFutureDays() {
    this.isShowingFutureDays = true;
    let futureDays: Array<DayPlanTileComponent> = this.dayComponents.filter((dayComponent: DayPlanTileComponent) => dayComponent.day.isDayInTheFuture());
    setTimeout(() => {
      futureDays[futureDays.length - 1].scrollInto()
    }, 100);
  }

}
