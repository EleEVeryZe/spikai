import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SharedUiService } from '../../services/shared-ui.service';
import { DRAWER_ICON } from '../../util/constants';
@Component({
  selector: 'app-sidenav',
  imports: [MatSidenavModule, MatToolbarModule, MatIconModule, MatListModule, MatButtonModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  logout() {
    // Faça logout real aqui
    console.log('Logging out...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @ViewChild('drawer') drawer!: MatSidenav;
  icon: DRAWER_ICON = 'BACK';
  navigateToUrl: string = "";

  constructor(private readonly sharedService: SharedUiService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.sharedService.trigger$.subscribe((navigateToUrl) => {
      this.navigateToUrl = navigateToUrl;
    });
  }

  goBack() {
    this.router.navigate(['/' + this.navigateToUrl]);
    this.navigateToUrl = "";
  }
}
