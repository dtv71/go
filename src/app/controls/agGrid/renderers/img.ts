import { Constants, ICellRendererComp, ICellRendererParams } from "ag-grid-community";

export class Img implements ICellRendererComp {
    constructor() { }

    eGui!: HTMLSpanElement;

    // Optional: Params for rendering. The same params that are passed to the cellRenderer function.
    init(params: ICellRendererParams) {
        let img: HTMLImageElement = document.createElement('img');
        img.src = `${params.value}`;
        img.setAttribute('class', 'logo');

        this.eGui = document.createElement('span');
        this.eGui.setAttribute('class', 'imgSpanLogo');
        this.eGui.appendChild(img);
    }

    // Required: Return the DOM element of the component, this is what the grid puts into the cell
    getGui() {
        return this.eGui;
    }

    // Required: Get the cell to refresh.
    refresh(params: ICellRendererParams): boolean {
        return false;
    }
}

