import {
    Directive, EventEmitter, Input, Output, OnInit, OnDestroy,
    ComponentRef, ElementRef, TemplateRef, forwardRef, NgZone,
    ChangeDetectorRef, Renderer2, HostListener, ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable, Subject, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { PopupService } from './typeahead.popup.service';
import { TypeaheadConfigService } from './typeahead.config.service';
import { TypeaheadList, ResultTemplateContext } from './typeahead-list';

import { Keys, } from '../elements/element.key';
import { autoClose } from '../elements/element.autoClose';
import { positionElements, Placement } from '../elements/element.position';

let nextWindowId = 0;

const TYPEAHEAD_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR, multi: true,
    useExisting: forwardRef(() => Typeahead),
};

@Directive({
    selector: 'input[typeahead]',
    exportAs: 'typeahead',
    providers: [TYPEAHEAD_VALUE_ACCESSOR, PopupService],
    host: {
        '(blur)': 'handleBlur()',
        '(focus)': 'handleFocus()',
        '(keydown)': 'handleKeyDown($event)',
        '[class.typeahead-caret]': 'showCaret',
        'role': 'combobox',
        '[autocomplete]': 'autocomplete',
        'autocorrect': 'off',
        'autocapitalize': 'off',
        'aria-multiline': 'false',
        'attr.aria-autocomplete': "list",
        // '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
        '[attr.aria-activedescendant]': 'activeDescendant',
        '[attr.aria-owns]': 'popup.isOpen() ? popupId : null',
        '[attr.aria-expanded]': 'popup.isOpen()'
    },
})
export class Typeahead implements OnInit, OnDestroy, ControlValueAccessor {
    constructor(private elementRef: ElementRef<HTMLInputElement>,
        private viewContainerRef: ViewContainerRef,
        private changeDetector: ChangeDetectorRef,
        public popup: PopupService<TypeaheadList>,
        private config: TypeaheadConfigService,
        private renderer: Renderer2, private ngZone: NgZone) {

        this.editable = config.editable;
        // this.minLength = config.minTextLength || 0;
        this.zonePositionSubscription = ngZone.onStable.subscribe(() => {
            if (this.popup.isOpen()) {
                positionElements(
                    this.elementRef.nativeElement,
                    this.popup.windowRef!.location.nativeElement,
                    this.placement || ['bottom-left', 'top-left']
                )
            }
        });
    }

    /** 
     * If `true`, model values will NOT be restricted only to items selected from the popup. 
     * model will be updated as typed
    */
    @Input() editable: boolean;
    @Input() autoFill: boolean;
    @Input() multiple: boolean;
    @Input() focusFirst: boolean = true;
    @Input() autocomplete: string = 'off';

    @Input() minLength: number;
    @Input() placement: Placement;
    @Input() resetAfterSelection: boolean;

    @Input() colDef: { property: string, class?: string }[];
    @Input() listTemplate: TemplateRef<ResultTemplateContext>;
    @Input() resultFormatter: (item) => any;

    @Input('bind') bindModel: string;
    @Input('display') inputFormat: string | ((item) => string);
    @Input('typeahead') dataSource: (text: string | Observable<string>) => Observable<readonly any[]>;
    @Input('listMaxHeight') maxHeight: number = 300;

    @Output() modelInit = new EventEmitter<any>();
    @Output() selectItem = new EventEmitter<any>();

    public showCaret = true;
    public popupId = `typeahead-${++nextWindowId}`;
    public activeDescendant: string | null = null;

    private lastSelectedValue;
    private zonePositionSubscription;
    private valueChanges: Subject<string> = new Subject();

    ngOnInit(): void {
        this.minLength = this.minLength || this.config.minTextLength || 0;
        this.bindModel = this.bindModel || this.config.defaultProperty;
        this.inputFormat = this.inputFormat || this.config.defaultLabel;
        //console.log('this.inputFormat', this.inputFormat)
        //console.log('this.bindModel', this.bindModel)


        this.valueChanges.pipe(
            this.config.dataSourceMiddlewarePipe,
            (this.config.isDataSourcePipe ? this.dataSource : switchMap(value => this.dataSource(value))),
        ).subscribe(results => {
            //console.log('results', results)
            if (!this.popup.isOpen()) { this.openPopup() }
            this.popup.setParams({
                focusFirst: this.focusFirst,
                searchText: this.elementRef.nativeElement.value,
                data: results,
            });
            this.popup.windowRef!.instance.resetActive();
            // The observable stream we are subscribing to might have async steps
            // and if a component containing typeahead is using the OnPush strategy
            // the change detection turn wouldn't be invoked automatically.
            this.popup.windowRef!.changeDetectorRef.detectChanges();
        })
    }
    ngOnDestroy(): void {
        this.closePopup();
        this.valueChanges.unsubscribe();
        this.zonePositionSubscription.unsubscribe();
    }
    // ngOnChanges(changes: SimpleChanges) {
    //     if (changes.multiple) { this.itemsList.clearSelected() }
    //     if (changes.items) { this._setItems(changes.items.currentValue || []) }
    //     if (changes.isOpen) { this._manualOpen = isDefined(changes.isOpen.currentValue) }
    // }

    private skipViewUpdate: boolean;
    private onTouched: () => void;
    private changeModel: (newValue: any) => void;  // write to model
    registerOnChange(fn: any): void { this.changeModel = fn }
    registerOnTouched(fn: () => any): void { this.onTouched = fn }
    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled)
    }

    // view => model
    @HostListener('input', ['$event.target.value'])
    input(value) {
        this.showCaret = false;
        this.skipViewUpdate = true;
        this.changeModel(this.editable ? value : undefined); // calls writeValue

        if (value.length >= this.minLength) {
            this.focusFirst = true;
            this.openPopup();
            this.valueChanges.next(value || '')
        }
    }
    // model => view
    writeValue(value) {
        if (this.skipViewUpdate) {
            this.skipViewUpdate = false
        } else if (!value) {
            this.writeInputValue('')
        } else {
            of('').pipe(
                take(1),
                this.config.isDataSourcePipe ? this.dataSource : switchMap(value => this.dataSource(value))
            ).subscribe(data => {
                //console.log('data', data)
                const item = data && data.find((item) => {
                    return this.bindModel ? item[this.bindModel] == value : item == value
                });
                this.lastSelectedValue = item;
                this.writeInputValue(!item ? '' : this.formatItemForInput(item));
                if (!(this.modelInit.closed || this.modelInit.isStopped)) { // emit only once
                    this.modelInit.emit(item);
                    this.modelInit.complete();
                }
            })
        }
    }

    private writeInputValue(value: string): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value); // write to input
    }
    private formatItemForInput(item): string {
        switch (typeof this.inputFormat) {
            case 'string': return item && item[this.inputFormat] || '';
            case 'function': return this.inputFormat(item);
            default: return item;
        }
    }

    handleFocus() {
        this.elementRef.nativeElement.select();
        // this.skipViewUpdate = true; // dont update view
        // this.changeModel(undefined); // set model undefined
        if (!this.minLength) { this.valueChanges.next('') }
    }
    handleBlur() {
        this.closePopup();
        this.onTouched();
    }

    handleKeyDown(event: KeyboardEvent) {
        if (!this.popup.isOpen()) { return }
        switch (event.which) {
            case Keys.ArrowDown: this.handleArrowDown(event); break;
            case Keys.ArrowUp: this.handleArrowUp(event); break;
            case Keys.Enter:
            case Keys.Tab:
                this.handleEnterTab(event); break;
            case Keys.Escape: this.handleEscape(event); break;
        }
    }
    private handleArrowUp(event: KeyboardEvent) {
        event.preventDefault();
        this.popup.windowRef!.instance.prev();
    }
    private handleArrowDown(event: KeyboardEvent) {
        event.preventDefault();
        this.popup.windowRef!.instance.next();
    }
    private handleEnterTab(event: KeyboardEvent) {
        const result = this.popup.windowRef!.instance.getActive();
        if (!!result) {
            event.preventDefault();
            event.stopPropagation();
            this.selectResult(result);
        }
        this.closePopup();
    }
    private handleEscape(event: KeyboardEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.closePopup();
    }


    private openPopup() {
        if (!this.popup.isOpen()) {
            this.popup.open(TypeaheadList, this.viewContainerRef, undefined, undefined, {
                id: this.popupId,
                colDef: this.colDef,
                maxHeigth: this.maxHeight,
                focusFirst: this.focusFirst,
                minWidth: this.elementRef.nativeElement.getBoundingClientRect().width,
                resultFormatter: this.resultFormatter,
                itemTemplate: this.listTemplate
            });
            this.popup.windowRef.instance.selectEvent.subscribe(item => this.selectAndClosePopup(item));
            this.popup.windowRef.instance.activeChangeEvent.subscribe((activeId: string) => this.activeDescendant = activeId);
            this.changeDetector.markForCheck();
            autoClose(
                this.ngZone, document, 'outside', () => this.closePopup(), new Subject(),
                [this.elementRef.nativeElement, this.popup.windowRef.location.nativeElement]
            );
        }
    }
    private closePopup() {
        // clear input if not selected / rewrite value
        this.popup.close(this.viewContainerRef);
        this.activeDescendant = null;
        this.showCaret = true;
    }
    private selectResult(item: any) {
        this.lastSelectedValue = item;
        this.changeModel(this.bindModel ? item[this.bindModel] : item);
        this.writeInputValue(!item ? '' : this.formatItemForInput(item));
        this.selectItem.emit(item);
    }
    private selectAndClosePopup(item: any) {
        this.selectResult(item);
        this.closePopup();
    }
}