import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { SuperHero } from '../models/super-hero.model';
import { SuperheroService } from './super-hero.service';

describe('SuperheroService', () => {
  let service: SuperheroService;
  let httpMock: HttpTestingController;

  const mockHeroes: SuperHero[] = [
    {
      id: 1,
      name: 'Superman',
      alterEgo: 'Clark Kent',
      strength: 0,
      speed: 0,
      intelligence: 0,
    },
    {
      id: 2,
      name: 'Batman',
      alterEgo: 'Bruce Wayne',
      strength: 0,
      speed: 0,
      intelligence: 0,
    },
    {
      id: 3,
      name: 'Wonder Woman',
      alterEgo: 'Diana Prince',
      strength: 0,
      speed: 0,
      intelligence: 0,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        SuperheroService,
      ],
    });
    service = TestBed.inject(SuperheroService);
    httpMock = TestBed.inject(HttpTestingController);

    // Maneja la carga inicial del servicio
    const req = httpMock.expectOne('assets/superheros.json');
    req.flush(mockHeroes);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden solicitudes abiertas
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load superheroes from JSON', () => {
    service.superheroes$.subscribe((heroes) => {
      expect(heroes).toEqual(mockHeroes);
    });
  });

  it('should get all superheroes', () => {
    service['superheroesSubject'].next(mockHeroes);

    service.getSuperheroes().subscribe((heroes) => {
      expect(heroes).toEqual(mockHeroes);
    });
  });

  it('should get paginated superheroes', () => {
    service['superheroesSubject'].next(mockHeroes);

    service.getSuperheroesPaginated(1, 2).subscribe((heroes) => {
      expect(heroes).toEqual([mockHeroes[0], mockHeroes[1]]);
    });
  });

  it('should search superheroes by name', () => {
    service['superheroesSubject'].next(mockHeroes);

    service.searchSuperheroes('Super').subscribe((heroes) => {
      expect(heroes).toEqual([mockHeroes[0]]);
    });
  });

  it('should get a superhero by ID', () => {
    service['superheroesSubject'].next(mockHeroes);

    service.getSuperheroById(1).subscribe((hero) => {
      expect(hero).toEqual(mockHeroes[0]);
    });
  });

  it('should create a new superhero', () => {
    service['superheroesSubject'].next(mockHeroes);

    const newHero = {
      name: 'Flash',
      alterEgo: 'Barry Allen',
      strength: 0,
      speed: 0,
      intelligence: 0,
    };
    service.createSuperhero(newHero);

    service.superheroes$.subscribe((heroes) => {
      expect(heroes.length).toBe(4);
      expect(heroes[3].name).toBe('Flash');
    });
  });

  it('should update an existing superhero', () => {
    service['superheroesSubject'].next(mockHeroes);

    service.updateSuperhero(1, { name: 'Superman Updated' });

    service.superheroes$.subscribe((heroes) => {
      expect(heroes[0].name).toBe('Superman Updated');
    });
  });

  it('should delete a superhero by ID', () => {
    service['superheroesSubject'].next(mockHeroes);

    service.deleteSuperhero(1);

    service.superheroes$.subscribe((heroes) => {
      expect(heroes.length).toBe(2);
      expect(heroes.find((hero) => hero.id === 1)).toBeUndefined();
    });
  });

  it('should generate a unique ID for a new superhero', () => {
    const currentHeroes = mockHeroes;
    const newId = service['generateId'](currentHeroes);
    expect(newId).toBe(4);
  });
});
