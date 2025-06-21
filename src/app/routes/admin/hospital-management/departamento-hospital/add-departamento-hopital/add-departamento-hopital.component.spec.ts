import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepartamentoHopitalComponent } from './add-departamento-hopital.component';

describe('AddDepartamentoHopitalComponent', () => {
  let component: AddDepartamentoHopitalComponent;
  let fixture: ComponentFixture<AddDepartamentoHopitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDepartamentoHopitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDepartamentoHopitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
