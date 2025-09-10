import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImovelService } from '../../services/imovel.service';
import { SharedUiService } from '../../services/shared-ui.service';

@Component({
  selector: 'app-imovel-details',
  imports: [],
  templateUrl: './imovel-details.component.html',
  styleUrl: './imovel-details.component.scss',
})
export class ImovelDetailsComponent implements OnInit {
  constructor(
    private readonly imovelService: ImovelService,
    private readonly route: Router,
    private readonly sharedUi: SharedUiService
  ) {}

  ngOnInit(): void {
    this.sharedUi.changeDrawerIconAndFunction("BACK");
  }

  @Input()
  set id(id: string) {
    const imovel = this.imovelService.getById(id);
    if (!imovel) this.route.navigate(['/not-found']);
  }
}
