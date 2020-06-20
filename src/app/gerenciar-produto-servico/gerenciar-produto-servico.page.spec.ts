import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GerenciarProdutoServicoPage } from './gerenciar-produto-servico.page';

describe('GerenciarProdutoServicoPage', () => {
  let component: GerenciarProdutoServicoPage;
  let fixture: ComponentFixture<GerenciarProdutoServicoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerenciarProdutoServicoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarProdutoServicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
