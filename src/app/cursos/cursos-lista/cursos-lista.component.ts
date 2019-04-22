import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalService } from './../../shared/alert-modal.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CursosService } from '../cursos.service';
import { Curso } from '../curso';
import { Observable, empty, Subject, EMPTY } from 'rxjs';
import { catchError, take, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss']
})
export class CursosListaComponent implements OnInit {

  cursos$: Observable<Curso[]>;
  error$ = new Subject<boolean>();
  deleteModalRef: BsModalRef;
  //@ViewChild('deleteModal') deleteModal;
  // selectedCurso: Curso

  constructor(
    private service: CursosService,
    private alertService: AlertModalService,
    //private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.onRefresh()
  }

  onRefresh() {
    this.cursos$ = this.service.list()
      .pipe(
        catchError(error => {
          console.log(error);
          this.handleError();
          return empty();
        })
      );

  }

  handleError() {
    this.alertService.showAlertDanger('Erro ao carregar cursos. Tente novamente mais tarde...')
  }

  onEdit(id: number){
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  onDelete(curso: Curso) {
    //this.selectedCurso = curso
    // this.deleteModalRef = this.modalService.show(this.deleteModal, {class: 'modal-sm'})
    const result$ = this.alertService.showConfirm('Deletar Curso', 'Tem certeza que deseja remover esse Curso?')

    result$.asObservable()
    .pipe(take(1),
    switchMap(result => result ? this.service.delete(curso.id) : EMPTY)
    ).subscribe(
      success => {
        this.onRefresh()
      },
      error => {
        this.alertService.showAlertDanger('Erro ao deletar o curso. Tente novamente mais tarde...')
      }
    )
  }

  /*
  onConfirmDelete(): void {
    this.service.delete(this.selectedCurso.id)
      .subscribe(
        success => this.onRefresh(),
        error => {
          this.alertService.showAlertDanger('Erro ao deletar o curso. Tente novamente mais tarde...')
        }
      )

    this.deleteModalRef.hide();
  }
  */
 
  // onDeclineDelete(): void {
  //   this.deleteModalRef.hide();
  // }

}