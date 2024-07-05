import {
  Component, OnInit, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation
} from '@angular/core';
import { TypeaheadConfigService } from './typeahead.config.service';

export interface ListItemColDef { property: string; class?: string; prepend?: any, append?: any }
export interface ResultTemplateContext { result: any; term: string; }

@Component({
  selector: 'typeahead-list',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[id]': 'id',
    'role': 'listbox',
    'class': 'dropdown-menu show',
    // '[style.left]': "'auto'",
    '[style.overflow]': "'auto'",
    '[style.min-width]': "minWidth+'px'",
    '[style.width]': "'max-content'",
    '[style.max-height]': "maxHeigth+'px'",
    '(mousedown)': '$event.preventDefault()',
  },
  template: `
    <ng-template #rt let-item="item" let-term="searchText">
      <!-- {{item.nume}} <ngb-highlight [item]="item" [search]="term"></ngb-highlight> -->
      <div *ngFor="let col of colDef" [ngClass]="col.class || 'col'">
        <span *ngIf="col.prepend" class="me-1" [innerHTML]="col.prepend(item)"></span>
        {{item[col.property]}}
        <!-- <span [innerHtml]="getLabel(col, item)"></span> -->
        <span *ngIf="col.append" class="ms-1" [innerHTML]="col.append(item)"></span>
      </div>      
    </ng-template>
    <p *ngIf="!data" class="ms-3 mb-2"><i class="fal fa-spinner fa-spin fa-pulse"></i>&nbsp;Loading...</p>
    <p *ngIf="data && !data.length" class="text-center my-1">Nu există rezultate...</p>
    
    <ng-template ngFor [ngForOf]="data" let-option let-idx="index">
      <button type="button" role="option" 
        class="dropdown-item" [id]="id+'-'+idx" [class.active]="idx === activeIdx"
        (mouseenter)="markActive(idx)" (click)="select(option)">  
        <div class="row">
          <ng-template [ngTemplateOutlet]="itemTemplate || rt" [ngTemplateOutletContext]="{item: option, term: searchText}"></ng-template>
        </div>
      </button>
    </ng-template>`
})
export class TypeaheadList implements OnInit {
  constructor(private config: TypeaheadConfigService) { }

  activeIdx!: number;
  @Input() id!: string;
  @Input() minWidth!: number;
  @Input() maxHeigth: number = 300;
  @Input() focusFirst = true;
  @Input() searchText!: string;
  @Input() data!: readonly any[];
  @Input() resultFormatter!: any;

  @Input() colDef!: ListItemColDef[];
  @Input() itemTemplate!: TemplateRef<ResultTemplateContext>;

  /** Event raised when user selects a particular result row */
  @Output('select') selectEvent = new EventEmitter();
  @Output('activeChange') activeChangeEvent = new EventEmitter();

  ngOnInit() {
    if (!this.colDef) { this.colDef = this.config.defaultColDef }
    // this.minWidth = this.minWidth + 200;
    this.resetActive()
  }
  getLabel(col: any, item: any) {
    if (typeof col.property == 'function') { return col.property(item) }
    return item[col.property]
  }
  select(item: any) { this.selectEvent.emit(item) }
  getActive() { return this.data[this.activeIdx] }
  hasActive() { return this.activeIdx > -1 && this.activeIdx < this.data.length }

  private activeChanged() {
    this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined)
  }
  markActive(activeIdx: number) {
    this.activeIdx = activeIdx;
    this.activeChanged();
  }
  resetActive() {
    this.activeIdx = this.focusFirst ? 0 : -1;
    this.activeChanged();
  }

  next() {
    if (this.activeIdx === this.data.length - 1) {
      this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.data.length : -1
    } else {
      this.activeIdx++
    }
    this.setChange()
  }
  prev() {
    if (this.activeIdx < 0) {
      this.activeIdx = this.data.length - 1
    } else if (this.activeIdx === 0) {
      this.activeIdx = this.focusFirst ? this.data.length - 1 : -1
    } else {
      this.activeIdx--
    }
    this.setChange()
  }
  private setChange() {
    this.activeChanged();
    const el = document.querySelector('.active');
    el && el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
