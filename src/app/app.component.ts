import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { ImovelService } from './services/imovel.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    FormsModule, 
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ImovelService, provideNgxMask()]
 
})
export class AppComponent {
}
