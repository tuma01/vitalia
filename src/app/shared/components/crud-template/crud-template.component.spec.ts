import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTemplateComponent } from './crud-template.component';

describe('CrudTemplateComponent', () => {
  let component: CrudTemplateComponent;
  let fixture: ComponentFixture<CrudTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
