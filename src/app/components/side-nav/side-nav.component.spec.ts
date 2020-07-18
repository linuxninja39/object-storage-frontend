import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SideNavComponent} from './side-nav.component';
import {MatListModule} from '@angular/material/list';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatListModule
      ],
      declarations: [SideNavComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have nav list', () => {
    const compiled = fixture.nativeElement;
    const navList = compiled.querySelector('mat-nav-list');
    expect(navList).toBeTruthy();
    expect(navList.children.length).toBe(2);
  });
});
