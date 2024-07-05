import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Typeahead } from './typeahead';
import { TypeaheadList } from './typeahead-list';

import { TypeaheadConfigService } from './typeahead.config.service';

@NgModule({
  imports: [CommonModule],
  exports: [Typeahead],
  providers: [TypeaheadConfigService],
  declarations: [Typeahead, TypeaheadList],
})
export class TypeaheadModule { }