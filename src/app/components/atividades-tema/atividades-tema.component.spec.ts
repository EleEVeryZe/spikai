import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadesTemaComponent } from './atividades-tema.component';

describe('AtividadesTemaComponent', () => {
  let component: AtividadesTemaComponent;
  let fixture: ComponentFixture<AtividadesTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtividadesTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtividadesTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
