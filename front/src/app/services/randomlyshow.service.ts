import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RandomlyShowService {

  private isRunning: boolean = false;
  private isLessoning: boolean = false;
  private allLessons!: any[];
  lessons: any[] = [];
  private handler?: (lesson: any) => Promise<void>;
  private isStarted = false;
  private shownLessonsIndices: Set<number> = new Set();

  setAllLessons(allLessons: any[]) {
    this.allLessons = allLessons;
    this.shownLessonsIndices.clear();
  }

  stop() {
    this.lessons = [];
    this.isRunning = false;
    this.shownLessonsIndices.clear();
  }

  pause() {
    this.isRunning = false;
  }

  next() {
    if (!this.allLessons || this.allLessons.length === 0) {
      return;
    }

    const unshownIndices = this.allLessons
      .map((_, index) => index)
      .filter(index => !this.shownLessonsIndices.has(index));

    if (unshownIndices.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * unshownIndices.length);
    const selectedIndex = unshownIndices[randomIndex];
    const selectedLesson = this.allLessons[selectedIndex];

    this.shownLessonsIndices.add(selectedIndex);

    return selectedLesson;
  }

  getSize() {
    return this.allLessons.length
  }

  getCurrent() {
    return this.shownLessonsIndices.size;
  }


  async restart() {
    this.shownLessonsIndices.clear();
  }

  getIsStarted = () => this.isStarted;
}
