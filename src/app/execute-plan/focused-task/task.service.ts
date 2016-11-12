import {Injectable, OpaqueToken} from '@angular/core';
import {SuccessCallback, ErrorCallback} from '../../shared/callback';
import {Day, Task, DayJson, TaskJson} from '../../task/task';
import {CookieService} from 'angular2-cookie/services/cookies.service';

export class DaysFromJsonMapper {

  public createDaysFrom(dayMap: any): Array<Day> {
    let result: Array<Day> = [];
    if (dayMap != null) {
      Object.getOwnPropertyNames(dayMap).forEach((key: string) => {
        result.push(this.createDayFrom(dayMap[key]));
      });
    }
    return result;
  }

  private createDayFrom(dayJson: DayJson): Day {
    return new Day(dayJson.name, this.createTasksFrom(dayJson.tasks), dayJson.timeline, new Date(dayJson.time));
  }

  private createTasksFrom(tasks: Array<TaskJson>): Array<Task> {
    let result: Array<Task> = [];
    tasks.forEach((taskJson: TaskJson) => {
      result.push(this.createTaskFrom(taskJson));
    });
    return result;
  }

  private createTaskFrom(taskJson: TaskJson): Task {
    return new Task(taskJson.name, taskJson.done);
  }
}

export interface TaskService {
  getDays(successCallback: SuccessCallback<Array<Day>>, errorCallback?: ErrorCallback): void;
  saveDays(days: Array<Day>, successCallback: SuccessCallback<any>, errorCallback?: ErrorCallback): void;
  saveDay(day: Day, successCallback: SuccessCallback<any>): void;
}

export const TaskServiceToken = new OpaqueToken('taskService');

@Injectable()
export class CookieTaskService implements TaskService {
  private cookieService: CookieService;
  private dayFromJsonMapper: DaysFromJsonMapper;

  constructor(cookieService: CookieService, dayFromJsonMapper: DaysFromJsonMapper) {
    this.cookieService = cookieService;
    this.dayFromJsonMapper = dayFromJsonMapper;

  }

  public getDays(successCallback: SuccessCallback<Array<Day>>, errorCallback?: ErrorCallback) {
    let dayMap: any = this.getDayMap();
    let result: Array<Day> = this.dayFromJsonMapper.createDaysFrom(dayMap);
    if (result.length == 0) {
      result = this.createEmptyWeek();
    }
    successCallback(result);
  }

  public saveDays(days: Array<Day>, successCallback: SuccessCallback<any>, errorCallback?: ErrorCallback) {
    days.forEach((day: Day) => this.saveDayInCookie(day));
    successCallback(null);
  }

  private createEmptyWeek(): Array<Day> {
    let result: Array<Day> = [];
    result.push(new Day('Pn', [], 'current', null));
    result.push(new Day('Wt', [], 'current', null));
    result.push(new Day('Sr', [], 'current', null));
    result.push(new Day('Czw', [], 'current', null));
    result.push(new Day('Pt', [], 'current', null));
    result.push(new Day('Sb', [], 'current', null));
    result.push(new Day('Nd', [], 'current', null));
    return result;
  }

  public saveDay(day: Day, successCallback: SuccessCallback<any>) {
    this.saveDayInCookie(day);
    successCallback(null);
  }

  private getDayMap(): any {
    return this.cookieService.getObject('dayMap');
  }

  private getDayMapOrCreateEmpty(): any {
    let result: any = this.getDayMap();
    if (!result) {
      result = {};
    }
    return result;
  }

  private saveDayInCookie(day: Day) {
    let dayMap: any = this.getDayMapOrCreateEmpty();
    dayMap[day.name] = day.asJson();
    this.cookieService.putObject('dayMap', dayMap);
  }

}
