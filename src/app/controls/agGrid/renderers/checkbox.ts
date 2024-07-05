import { Constants, ICellRendererComp, ICellRendererParams } from "ag-grid-community";

export class Checkbox implements ICellRendererComp {
    constructor() { this.removeHandlersFunctions = [] }

    private eGui!: HTMLInputElement;
    private params!: ICellRendererParams;
    private removeHandlersFunctions: any[];

    getGui() { return this.eGui }
    destroy() { this.removeHandlersFunctions.forEach(f => f()) }
    refresh(params: ICellRendererParams) {
        this.eGui.checked = params.value;
        return true;
    }

    init(params: ICellRendererParams) {
        this.params = params;
        this.eGui = document.createElement('input');
        this.eGui.type = 'checkbox';

        if (params.node.group || !params.column!.isCellEditable(params.node)) {
            this.eGui.disabled = true
        } else {
            this.addEventListener(this.eGui, 'mousedown', this.onMouseDown.bind(this));
            this.addEventListener(this.eGui, 'keydown', (event: any) => {
                event.stopPropagation();
                // if (event.keyCode === Constants.KEY_SPACE)
                //     this.params.api['gridPanel'].processMouseEvent('dblclick', event, this.params.eGridCell);
            });
            this.addEventListener(this.eGui, 'dblclick', () => { return false });
        }
        this.eGui.checked = params.value == 1 || params.value == true;
    }

    private onMouseDown(event: MouseEvent) {
        event.stopPropagation();
        if (event.button == 0) {
            //this.params.api['gridPanel'].processMouseEvent('dblclick', event, this.params.eGridCell)
        }
    }
    private addEventListener(element: Element, event: string, listener: (event: any) => void) {
        element.addEventListener(event, listener);
        this.removeHandlersFunctions.push(() => element.removeEventListener(event, listener));
    }
}