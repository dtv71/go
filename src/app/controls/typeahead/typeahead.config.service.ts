import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';
import { Placement } from '../elements/element.position';

@Injectable({ providedIn: 'root' })
export class TypeaheadConfigService {
  constructor() { }

  /** If editable is active, model will be updated with view when typed */
  editable: boolean = false;
  /** Minimum number of characters befere list is shown */
  minTextLength: number = 0;
  /** Maximum height of results list, measured in px */
  listMaxHeight: number = 300;
  /** Focus furst element from the results list */
  placement!: Placement;
  /** Focus first element from the results list */
  focusFirst!: boolean;

  /** Default label to display in control when selecting from results list */
  defaultLabel: string = 's_numefull';
  /** Default property to bind in model when selecting from results list */
  defaultProperty: string = 'id';
  /** Default columns definition for results list */
  defaultColDef: { property: string, class?: string }[] = [{ property: 's_numefull' }];

  /** Turns dataSource binding into a pipe or regular function */
  isDataSourcePipe: boolean = false;

  /** Default pipes for every dataSource */
  dataSourceMiddlewarePipe: (text: Observable<string>) => Observable<string> = pipe(
    debounceTime(300),
    distinctUntilChanged((prev, curr) => { return (prev === '' && curr === '') ? false : prev === curr })
  );
}