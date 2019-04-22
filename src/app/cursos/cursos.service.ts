import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Curso } from './curso';
import { delay, tap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
//import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private readonly API = `${environment.API}cursos`;

  constructor(private http: HttpClient) { }

  list(){
    return this.http.get<Curso[]>(this.API)
    .pipe(
      delay(2000),
      //tap(console.log)
      );
  }

  loadByID(id){
    return this.http.get<Curso>(`${this.API}/${id}`).pipe(take(1));
  }

  private create(curso: Curso){
    return this.http.post<Curso>(this.API, curso).pipe(take(1));
  }

  private update(curso: Curso){
    return this.http.put<Curso>(`${this.API}/${curso.id}`, curso).pipe(take(1));
  }

  save(curso: Curso){
    if (curso.id) {
      return this.update(curso)
    } else {
      return this.create(curso)
    }
  }

  delete(id){
    return this.http.delete(`${this.API}/${id}`).pipe(take(1));
  }

}
