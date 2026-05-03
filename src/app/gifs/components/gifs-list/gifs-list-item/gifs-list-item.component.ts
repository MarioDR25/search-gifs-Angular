import { Component, input } from '@angular/core';
import Gif from '../../../interfaces/gif.interface';

@Component({
  selector: 'gifs-list-item',
  imports: [],
  templateUrl: './gifs-list-item.component.html',
})
export class GifsListItemComponent {
  gif = input.required<string>()
 }
