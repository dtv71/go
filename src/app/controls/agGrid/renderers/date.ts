import { ICellRendererComp, ICellRendererParams } from "ag-grid-community";
import  dayjs from "dayjs";

export interface IDateRenrederParams extends ICellRendererParams {
    displayProperty: string;
    format?: string;
}

export class Date implements ICellRendererComp {
    constructor() { }

    private eGui!: HTMLDivElement;

    getGui() { return this.eGui }
    refresh(params: IDateRenrederParams) {
        this.eGui.textContent = params.value ? dayjs(params.value).format(params.format || "DD.MM.YYYY") : '';
        return true;
    }
    init(params: IDateRenrederParams) {
        this.eGui = document.createElement('div');
        this.eGui.style.textAlign = 'center';
        params.format = params.format && params.format.toUpperCase() || "DD.MM.YYYY";
        if (params.value == '1900-01-01') {
            this.eGui.textContent = ''
        }else{
            this.eGui.textContent = params.value ? dayjs(params.value).format(params.format) : '';
        }
        
    }
}