import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuperHero } from '../models/super-hero.model';

@Injectable({
  providedIn: 'root',
})
export class SuperheroService {
  private readonly jsonUrl = 'assets/superheros.json';
  private superheroesSubject = new BehaviorSubject<SuperHero[]>([]);
  superheroes$ = this.superheroesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSuperheroes(); // Carga inicial de héroes
  }

  // Carga inicial de los héroes desde el archivo JSON
  private loadSuperheroes(): void {
    this.http.get<SuperHero[]>(this.jsonUrl).subscribe((heroes) => {
      this.superheroesSubject.next(heroes);
    });
  }

  // Obtener todos los superhéroes
  getSuperheroes(): Observable<SuperHero[]> {
    return this.superheroes$;
  }

  // Obtener héroes paginados
  getSuperheroesPaginated(
    page: number,
    itemsPerPage: number
  ): Observable<SuperHero[]> {
    return this.superheroes$.pipe(
      map((heroes) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return heroes.slice(startIndex, endIndex);
      })
    );
  }

  // Buscar héroes por nombre o alterEgo
  searchSuperheroes(query: string): Observable<SuperHero[]> {
    return this.superheroes$.pipe(
      map((heroes) =>
        heroes.filter((hero) =>
          hero.name.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  // Obtener un superhéroe por ID
  getSuperheroById(id: number): Observable<SuperHero | undefined> {
    return this.superheroes$.pipe(
      map((heroes) => heroes.find((hero) => hero.id === id))
    );
  }

  // Crear un nuevo superhéroe
  createSuperhero(hero: Omit<SuperHero, 'id'>): void {
    const currentHeroes = this.superheroesSubject.value;
    const newHero: SuperHero = {
      ...hero,
      id: this.generateId(currentHeroes),
    };
    this.superheroesSubject.next([...currentHeroes, newHero]);
  }

  // Editar un superhéroe existente
  updateSuperhero(id: number, updatedHero: Partial<SuperHero>): void {
    const currentHeroes = this.superheroesSubject.value;
    const updatedHeroes = currentHeroes.map((hero) =>
      hero.id === id ? { ...hero, ...updatedHero } : hero
    );
    this.superheroesSubject.next(updatedHeroes);
  }

  // Borrar un superhéroe
  deleteSuperhero(id: number): void {
    const currentHeroes = this.superheroesSubject.value;
    const updatedHeroes = currentHeroes.filter((hero) => hero.id !== id);
    this.superheroesSubject.next(updatedHeroes);
  }

  // Generar un nuevo ID único
  private generateId(currentHeroes: SuperHero[]): number {
    return currentHeroes.length > 0
      ? Math.max(...currentHeroes.map((hero) => hero.id)) + 1
      : 1;
  }
}
