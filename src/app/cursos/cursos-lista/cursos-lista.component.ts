import { Component, OnInit } from '@angular/core';
import { CursosService } from '../cursos.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Curso } from '../curso';
import { Observable, empty, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertModalComponent } from './../../shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss']
})
export class CursosListaComponent implements OnInit {

  cursos$: Observable<Curso[]>;
  error$ = new Subject<boolean>();
  bsModalRef: BsModalRef;

  constructor(private service: CursosService, private modalService: BsModalService) { }

  ngOnInit() {
    // this.service.list().subscribe(dados => this.cursos = dados)
    this.onRefresh()
  }

  onRefresh(){
    this.cursos$ = this.service.list()
      .pipe(
          catchError(error => {
            console.log(error);
            //this.error$.next(true);
            this.handleError();
            return empty();
          })
      );

    }

    handleError(){
      this.bsModalRef = this.modalService.show(AlertModalComponent);
      this.bsModalRef.content.type = 'danger';
      this.bsModalRef.content.message = 'Erro ao carregar cursos. Tente novamente mais tarde...';
    }
}
