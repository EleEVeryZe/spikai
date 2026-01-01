import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-previous-next-btn',
  imports: [MatIconModule, CommonModule, MatSliderModule, MatDividerModule, MatCardModule, MatButtonModule],
  templateUrl: './previous-next-btn.component.html',
  styleUrl: './previous-next-btn.component.scss',
})
export class PreviousNextBtnComponent {
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Input() disablePrevious: boolean = false;
  @Input() disableNext: boolean = false;

  onPrevious() {
    this.previous.emit();
  }

  onNext() {
    this.next.emit();
  }
}
