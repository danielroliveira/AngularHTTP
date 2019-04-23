import { HttpClient } from '@angular/common/http';
import { delay, take } from 'rxjs/operators';

export class CrudService<T> {
    
    constructor(protected http: HttpClient, private API_URL: string) {}

    list() {
        return this.http.get<T[]>(this.API_URL)
            .pipe(
                delay(2000),
            );
    }

    loadByID(id) {
        return this.http.get<T>(`${this.API_URL}/${id}`).pipe(take(1));
    }

    private create(registro: T) {
        return this.http.post<T>(this.API_URL, registro).pipe(take(1));
    }

    private update(registro: T) {
        return this.http.put<T>(`${this.API_URL}/${registro['id']}`, registro).pipe(take(1));
    }

    save(registro: T) {
        if (registro['id']) {
            return this.update(registro)
        } else {
            return this.create(registro)
        }
    }

    delete(id) {
        return this.http.delete(`${this.API_URL}/${id}`).pipe(take(1));
    }
}
