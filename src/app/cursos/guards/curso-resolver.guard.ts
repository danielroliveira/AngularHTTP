import { CursosService } from './../cursos.service';
import { Curso } from './../curso';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoResolverGuard implements Resolve<Curso> {

  constructor(private service: CursosService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<Curso> {

    if (route.params && route.params['id']) {
      return this.service.loadByID(route.params['id']);
    }

    // return observable from object
    return of({
      id: null,
      nome: null
    })

  }

}
