import { Component, computed, inject, signal } from '@angular/core';
import { GifsListComponent } from '../../components/gifs-list/gifs-list.component';
import { GifService } from '../../services/gifs.service';

@Component({
  selector: 'app-trending-page.component',
  imports: [GifsListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent {
 
   gifsService = inject(GifService);

   
}
