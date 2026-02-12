import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollPositions = new Map<string, number>();

  constructor(private readonly router: Router) {
    this.router.events.subscribe((event) => {
      const el = document.querySelector('.mat-drawer-content') as HTMLElement
      if (event instanceof NavigationStart) {
        const path = this.router.url;
        
        this.scrollPositions.set(
          path,
          el?.scrollTop
        );
      }

      if (event instanceof NavigationEnd) {
        const path = this.router.url;
        setTimeout(() => {
          const saved = this.scrollPositions.get(path);
          if (saved != null) {
            el.scrollTo({ top: saved });
          }
        });
      }
    });
  }
}
