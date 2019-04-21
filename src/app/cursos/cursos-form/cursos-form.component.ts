import { ActivatedRoute } from '@angular/router';
import { AlertModalService } from './../../shared/alert-modal.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CursosService } from '../cursos.service';
import { Location } from '@angular/common';
import { switchMap, map } from 'rxjs/operators';

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

    // this.route.params.subscribe(
    //   (params: any) => {
    //     const id = params['id'];
    //     const curso$ = this.service.loadByID(id)
    //     curso$.subscribe(curso => {
    //       this.updateForm(curso);
    //     })
    //   }
    // )

    this.route.params
    .pipe(
      map((params: any) => params['id']), // map o ID
      switchMap(id => this.service.loadByID(id)) // recebe o ID e faz outro subscribe
    ).subscribe(curso => this.updateForm(curso));

      // swichMap -->
      // concatMap --> a ordem da requisicao importa
      // mergeMap --> a ordem da requisicao nao importa
      // exhaustMap --> casos de login

    this.form = this.fb.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
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
    //console.log(this.form.value);
    if (this.form.valid) {
      //console.log('submit');
      this.service.create(this.form.value).subscribe(
        success => {
          this.modal.showAlertSuccess('Curso criado com sucesso!');
          this.location.back();
        },
        error => this.modal.showAlertDanger('erro ao criar curso, tente novamente...'),
        () => console.log('request OK')
      )
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
