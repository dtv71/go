import { ICellRendererComp, ICellRendererParams, _ } from "ag-grid-community";

export interface INumericRenrederParams extends ICellRendererParams {
    decimals?: number;
    emptyIfZero?: boolean;
    zeroIfNotExists?: boolean;
    dangerClassIfNegative?: boolean;
}

export class NumericDecimal implements ICellRendererComp {

    private eGui: HTMLDivElement;
    private params: INumericRenrederParams;

    getGui() { return this.eGui }
    refresh(params: INumericRenrederParams): boolean {
        this.eGui.textContent = this.formatValue(params.value);
        return true;
    }

    init(params: INumericRenrederParams) {
        this.params = params;
        this.eGui = document.createElement('div');
        this.eGui.style.textAlign = 'right';
        if (params.eGridCell.children && params.eGridCell.children.length > 0) {
            params.eGridCell.children[0].classList.add('flex-row-reverse')
        }

        if (!params.hasOwnProperty('decimals')) {
            params.decimals = 2; // params.decimals!==0 in caz ca nu vreau sa am zecimale
        } else {
            params.decimals = Math.round(Math.max(params.decimals, 0)); // numaru de zecimale sa fie intreg nenegativ
        }
        if (this.params.dangerClassIfNegative) { this.setDangerClassIfNegative() }
        this.eGui.textContent = this.formatValue(this.params.value);
    }

    private formatValue(newValue: string): string {
        if (!_.exists(newValue)) {
            return this.params.zeroIfNotExists ? '0' : '';
        }
        if (newValue == '0' && this.params.emptyIfZero) { return ''; }

        var result: string = '';
        var value: string = String(newValue);
        var decimals: number = parseInt(<any>this.params.decimals);

        if (isNaN(decimals)) {
            console.log('NumericDecimalRenderer: NaN decimals value.');
            return '';
        }

        var idx: number = value.indexOf('.');

        if (idx != -1) {
            result = value.substring(0, idx);
            value = value.substring(idx + 1);
        } else {
            result = value;
            value = '';
        }
        idx = 3;
        //var length: number = result.length - (result[0] == '-' ? 1 : 0);
        //var y=x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        result = result.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        if (decimals) {
            if (decimals <= value.length) {
                result += (',' + value.substring(0, decimals));
                decimals = 0;
            } else {
                result += (',' + value);
                decimals -= value.length;// sa completeze cu 0 pana la numar de zecimale selectat daca nu le contine
                while (--decimals >= 0) { result += '0'; }
            }
        }
        return result;
    }

    private setDangerClassIfNegative() {
        var value: number = parseInt(this.params.value);
        if (isNaN(value)) {
            console.log(`NumericDecimalRenderer: NaN value on column ${this.params.colDef.field}.`);
            return;
        }
        //_.addOrRemoveCssClass(this.eGui, 'text-danger', value < 0);
    }
}