import { autoinject } from 'aurelia-framework';
import * as $ from 'jquery';

@autoinject()
export class Palette {

  constructor(private el: Element) {
  }

  openCategory: Element;

  toggleCategory(target: Element) {

    if (this.openCategory) {
      $(this.openCategory).addClass('palette-closed');
      $('.palette-content', this.openCategory).css('display', 'none');
    }

    if ((target != this.openCategory) && $(target).hasClass('palette-closed')) {
      $(target).removeClass('palette-closed');
      $('.palette-content', target).css('display', 'block');

      this.openCategory = target;
    }
    else
      this.openCategory = undefined;
  }

}
