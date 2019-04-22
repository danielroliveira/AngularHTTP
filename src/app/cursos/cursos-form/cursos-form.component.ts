import { Curso } from './../curso';
import { ActivatedRoute } from '@angular/router';
import { AlertModalService } from './../../shared/alert-modal.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CursosService } from '../cursos.service';
import { Location } from '@angular/common';
//import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.scss']
})
export class CursosFormComponent implements OnInit {

  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: CursosService,
    private modal: AlertModalService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    /*
    ==> 1a. FORMA
    this.route.params.subscribe(
      (params: any) => {
        const id = params['id'];
        const curso$ = this.service.loadByID(id)
        curso$.subscribe(curso => {
          this.updateForm(curso);
        })
      }
    )

    ==> 2a. FORMA
    this.route.params
    .pipe(
      map((params: any) => params['id']), // map o ID
      switchMap(id => this.service.loadByID(id)) // recebe o ID e faz outro subscribe
    ).subscribe(curso => this.updateForm(curso));

    ==> TIPOS DE MAPS RETORNA OBSERVABLE
    swichMap -->
    concatMap --> a ordem da requisicao importa
    mergeMap --> a ordem da requisicao nao importa
    exhaustMap --> casos de login

    */

    // GET DATA FROM RESOLVE
    const curso: Curso = this.route.snapshot.data['curso'];

    this.form = this.fb.group({
      id: [curso.id],
      nome: [curso.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    })
  }

  updateForm(curso){
    this.form.patchValue({
      id: curso.id,
      nome: curso.nome
    });
  }

  onSubmit() {
    this.submitted = true
    if (this.form.valid) {

      // define success and error messages
      let msgSucesso = 'Curso criado com sucesso!'
      let msgErro = 'Erro ao criar curso, tente novamente...'
      if (this.form.value.id){
        msgSucesso = 'Curso atualizado com sucesso!'
        msgErro = 'Erro ao atualizar curso, tente novamente...' 
      }

      this.service.save(this.form.value).subscribe(
        success => {
          this.modal.showAlertSuccess(msgSucesso);
          this.location.back();
        },
        error => this.modal.showAlertDanger(msgErro)
      )
      
      /*
      // Check if is UPDATE or CREATE
      if (this.form.value.id){
        // UPDATED
        this.service.update(this.form.value).subscribe(
          success => {
            this.modal.showAlertSuccess('Curso atualizado com sucesso!');
            this.location.back();
          },
          error => this.modal.showAlertDanger('erro ao atualizar curso, tente novamente...'),
          () => console.log('update OK')
        )
      } else {
        // CREATE
        this.service.create(this.form.value).subscribe(
          success => {
            this.modal.showAlertSuccess('Curso criado com sucesso!');
            this.location.back();
          },
          error => this.modal.showAlertDanger('erro ao criar curso, tente novamente...'),
          () => console.log('create OK')
        )
      }
      */
    }
  }

  onCancel() {
    this.submitted = false;
    this.form.reset();
    //console.log('cancel');
  }

  hasError(field: string) {
    return this.form.get(field).errors
  }

}
