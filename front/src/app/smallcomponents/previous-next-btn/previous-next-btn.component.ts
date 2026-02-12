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
  @Output() previous = new EventEmitter<number>();
  @Output() next = new EventEmitter<number>();
  @Input() disablePrevious: boolean = false;
  @Input() disableNext: boolean = false;
  @Input() infinityNext: boolean = false;
  
  
  @Input() totalSteps: number = -1;
  
  steps: number = 0;

  onPrevious() {
    this.disablePrevious = this.steps - 1 == 0;
    this.previous.emit(this.steps == 0 ? 0 : --this.steps);
  }

  onNext() {
    this.disablePrevious = false;
    
    if (this.infinityNext)
      this.disableNext = false;
    else   
      this.disableNext = this.totalSteps != -1 && this.steps >= this.totalSteps;

    this.next.emit(this.steps == this.totalSteps ? this.totalSteps : ++this.steps);
  }
}
