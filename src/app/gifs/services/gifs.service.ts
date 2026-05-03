import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import Gif from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY_LS = 'gifs';

/** Carga los GIFs almacenados previamente en el LocalStorage del navegador */
const loadFromLocalStorage = () => {
  const data = localStorage.getItem(GIF_KEY_LS) ?? '{}';
  return JSON.parse(data);
};

@Injectable({ providedIn: 'root' })
export class GifService {
  private http = inject(HttpClient);

  // --- Signals de Estado ---
  /** Almacena la lista de GIFs que son tendencia actualmente */
  trendingGifs = signal<Gif[]>([]);
  /** Indica si la carga de GIFs de tendencia está en proceso */
  trendingGifsLoading = signal(true);
  /** Diccionario que guarda los resultados de búsquedas previas { 'query': Gif[] } */
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  /** Lista computada de las palabras clave buscadas (extraídas de las llaves del historial) */
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    console.log('EL SERVICIO INICIADO...');
    this.loadTrendingGifs();
  }

  /** Efecto reactivo: Se dispara automáticamente cuando searchHistory cambia para persistir en LS */
  saveGifsLocalStorage = effect(() => {
    localStorage.setItem(GIF_KEY_LS, JSON.stringify(this.searchHistory()));
  });

  /** 
   * Realiza una petición HTTP para obtener los GIFs más populares 
   * Actualiza los signals trendingGifs y trendingGifsLoading
   */
  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      });
  }


  
  /**
   * Busca GIFs por una palabra clave, mapea la respuesta y actualiza el historial
   * @param query Término de búsqueda
   * @returns Observable con el arreglo de GIFs encontrados
   */
  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query,
        },
      })
      .pipe(
        map(({ data }) => data), // Extrae el arreglo 'data' de la respuesta
        map((items) => GifMapper.mapGiphyItemToGifArray(items)), // Transforma al formato de nuestra interfaz
        tap((items) => {
          // Actualiza el signal del historial agregando el nuevo resultado
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        }),
      );
  }



  /**
   * Recupera los GIFs de una búsqueda específica almacenada en el historial
   * @param query Término a buscar en la memoria local
   */


  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}