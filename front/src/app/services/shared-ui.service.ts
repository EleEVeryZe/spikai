import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DRAWER_ICON } from '../util/constants';

@Injectable({
  providedIn: 'root',
})
export class SharedUiService {
  private readonly triggerBackUrl = new Subject<string>();
  triggerBackUrl$ = this.triggerBackUrl.asObservable();

  private readonly triggerHideArrowBackToolbar = new Subject<boolean>();
  triggerHideArrowBackToolbar$ = this.triggerHideArrowBackToolbar.asObservable();

  scrollPageToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  hideArrowBackToolbar(vlr: boolean) {
    this.triggerHideArrowBackToolbar.next(vlr);
  }

  changeDrawerIconAndFunction(icon: DRAWER_ICON) {
    this.triggerBackUrl.next(icon);
  }

  goBackTo(whereURL: string) {
    this.triggerBackUrl.next(whereURL);
  }
}
