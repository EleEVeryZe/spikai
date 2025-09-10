import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DRAWER_ICON } from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class SharedUiService {
  private readonly trigger = new Subject<DRAWER_ICON>();
  trigger$ = this.trigger.asObservable();

  changeDrawerIconAndFunction(icon: DRAWER_ICON) {
    this.trigger.next(icon);
  }
}
