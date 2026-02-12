import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemorizacaoComponent } from './memorizacao.component';

describe('MemorizacaoComponent', () => {
  let component: MemorizacaoComponent;
  let fixture: ComponentFixture<MemorizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemorizacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemorizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
