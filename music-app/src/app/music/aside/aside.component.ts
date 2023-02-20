import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent {
  @Input() isSmall!: boolean;

  @Input() isHandset!: boolean;

  @Input() isExtraSmall!: boolean;
}
