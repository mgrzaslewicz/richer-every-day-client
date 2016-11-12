import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FocusedTaskComponent} from './execute-plan/focused-task/focused-task.component';
import {FocusedTaskControlComponent} from './execute-plan/focused-task-control/focused-task-control.component';
import {CountdownTimersComponent} from './countdown-timers/countdown-timers.component';
import {EventBusService} from './event-bus/event-bus.service';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExecutePlanComponent} from './execute-plan/execute-plan.component';
import {PlanningComponent} from './planning/planning.component';
import {PresentationComponent} from './presentation/presentation.component';
import {NotesComponent} from './notes/notes.component';
import {LeftMenuComponent} from './left-menu/left-menu.component';
import {CookieTaskService, TaskServiceToken} from './execute-plan/focused-task';
import {AppRoutingModule} from './app.routing-module';
import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import {RectangleProgressBarComponent} from './rectangle-progress-bar/rectangle-progress-bar.component';
import {DayTasksProgressComponent} from './day-tasks-progress/day-tasks-progress.component';
import {Safe} from './shared/pipes';
import {CookieService} from 'angular2-cookie/services/cookies.service';
import {DaysFromJsonMapper} from './execute-plan/focused-task/task.service';
import {HashLocationStrategy, LocationStrategy, APP_BASE_HREF} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LeftMenuComponent,
    FocusedTaskComponent,
    FocusedTaskControlComponent,
    CountdownTimersComponent,
    ExecutePlanComponent,
    PlanningComponent,
    PresentationComponent,
    NotesComponent,
    RectangleProgressBarComponent,
    DayTasksProgressComponent,
    Safe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    DragulaModule
  ],
  providers: [
    EventBusService,
    CookieService,
    DaysFromJsonMapper,
    {provide: TaskServiceToken, useClass: CookieTaskService},
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
