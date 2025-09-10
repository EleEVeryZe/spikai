import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { SharedUiService } from '../../services/shared-ui.service';
import { DRAWER_ICON } from '../../util/constants';
@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  icon: DRAWER_ICON = "SANDWISH";
  
  constructor(private readonly sharedService: SharedUiService, private router: Router) {}

  ngOnInit() {
    this.sharedService.trigger$.subscribe((changedIcon) => {
      this.icon = changedIcon;
    });
  }

  goBack() {
    this.icon = "SANDWISH";
    this.router.navigate(['/']);
  }
}
