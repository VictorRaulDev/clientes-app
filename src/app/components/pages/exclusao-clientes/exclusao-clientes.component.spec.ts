import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusaoClientesComponent } from './exclusao-clientes.component';

describe('ExclusaoClientesComponent', () => {
  let component: ExclusaoClientesComponent;
  let fixture: ComponentFixture<ExclusaoClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExclusaoClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExclusaoClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
