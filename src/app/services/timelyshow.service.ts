import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimelyShowService implements OnDestroy {
  private readonly endOfLesson = new Subject<boolean>();
  endOfLesson$ = this.endOfLesson.asObservable();

  private readonly speed = 1000;
  private timeout!: any;
  private isRunning: boolean = false;
  private isLessoning: boolean = false;
  private allLessons!: any[];
  lessons: any[] = [];
  private handler?: (lesson: any) => Promise<void>;
  private isStarted = false;
  private isStopped = false;
  private isPaused = false;
  

  setHandler(handler: (lesson: any) => Promise<void>) {
    this.handler = handler;
  }

  setAllLessons(allLessons: any[]) {
    this.allLessons = allLessons;
  }

  stop() {
    if (this.isStopped)
      return;
    this.lessons = [];
    clearInterval(this.timeout);
    this.isRunning = false;
    this.isStopped = true;
  }

  pause() {
    this.isRunning = false;
    this.isPaused = true;
  }

  async start() {
    if (this.allLessons == undefined || this.handler == undefined)
      throw new Error('Make sure all lessons and handler were initialized before executing this function.');

    this.isStarted = true;

    if (this.timeout) {
      this.isRunning = true;
      return;
    }

    this.isRunning = true;
    
    this.lessons = [];

    await this.execLesson(0);

    this.endOfLesson.next(false);
    
    this.startOrRestartFrom(1);
  }

  showAll() {
    clearInterval(this.timeout);
    this.lessons = this.allLessons;
    this.endOfLesson.next(true);
  }

  async restart(fromIdx: number) {
    clearInterval(this.timeout);

    this.isStopped = false;
    this.isRunning = true;
    this.timeout = setInterval(async () => {
      this.lessons = this.allLessons.slice(0, fromIdx + 1);
      if (!this.isLessoning && this.isRunning) {
        this.isLessoning = true;
        await this.execLesson(fromIdx);
        this.startOrRestartFrom(fromIdx + 1);
        this.isLessoning = false;
      }
    }, this.speed / 10);
  }

  execOnlyLesson(idx: number) {
    clearInterval(this.timeout);
    this.isRunning = true;
    const timeout = setInterval(async () => {
      if (!this.isLessoning && this.isRunning) {
        this.isLessoning = true;

        const lesson = this.allLessons[idx];
        await this.handler?.(lesson);

        this.isLessoning = false;
        
        if (this.timeout == timeout)
          clearInterval(timeout);
      }
    }, this.speed / 10);

    this.timeout = timeout;
  }

  private startOrRestartFrom(idx: number) {
    clearInterval(this.timeout);

    if (!this.allLessons || !this.handler)
      throw new Error('Make sure lessons and handler were initialized before executing this function.');

    let i = idx;

    this.timeout = setInterval(async () => {
      if (!this.isLessoning && this.isRunning && i < this.allLessons.length) {
        this.isLessoning = true;

        await this.execLesson(i);

        this.isLessoning = false;
        i++;
      }
    }, this.speed);
  }

  private async execLesson(idx: number) {
    const lesson = this.allLessons[idx];
    this.lessons = this.allLessons.slice(0, idx + 1);

    try {
      await this.handler?.(lesson);
    } catch {}
  }

  ngOnDestroy() {
    clearInterval(this.timeout);
  }

  getIsStarted = () => this.isStarted;

  getState = () => ( { isPaused: this.isPaused, isStarted: this.isStarted })
}
