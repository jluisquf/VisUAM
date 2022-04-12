import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoSectionComponent } from './equipo-section.component';

describe('EquipoSectionComponent', () => {
  let component: EquipoSectionComponent;
  let fixture: ComponentFixture<EquipoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipoSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
