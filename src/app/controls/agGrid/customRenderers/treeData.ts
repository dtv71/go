import { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

var idCount: number = 0;
const rowData: any[] = [];

export class TreeDataCellRenderer implements ICellRendererComp {

    eGui: HTMLSpanElement;
    params: ICellRendererParams;
    eventListener: () => void;

    rowDataExpanded: any[] = [];
    showBlankForExpanded: boolean;
    blankForExpandedObject;

    getGui() { return this.eGui }
    refresh() { return true }
    destroy() { this.eGui.removeEventListener('click', this.eventListener) }

    // init method gets the details of the cell to be renderer
    init(params: ICellRendererParams) {
        this.params = params;
        this.eGui = document.createElement("span");
        this.eGui.style.paddingLeft = `${params.data.level}px`;

        this.addIdInDataResurcive(params.data);
        if (params.data.children.length > 0) {
            if (params.data.expanded) {
                this.eGui.innerHTML = `<i class="fas fa-minus"></i> ` + params.value
            } else {
                this.eGui.innerHTML = `<i class="fas fa-plus"></i> ` + params.value
            }
        } else {
            this.eGui.innerHTML = params.value
        }
        this.eventListener = () => this.updateData(params.data.customId);
        this.eGui.addEventListener("click", this.eventListener);
    }

    private updateData(customId: number) {
        const foundData = this.recursiveFindById(this.params['treeData'], customId);
        if (foundData) {
            foundData.expanded = !foundData.expanded;
            this.rowDataExpanded = [];
            this.makeDataResurcive(this.params['treeData'], 0);
            this.params.api.setRowData(this.rowDataExpanded);
            // gridOptions.api.sizeColumnsToFit();
        }
    }

    private recursiveFindById(arrayData: any[], customId: number) {
        let foundData = arrayData.find(e => e.customId === customId);
        if (foundData) { return foundData }

        arrayData.every(e => {
            foundData = this.recursiveFindById(e.childrens, customId);
            if (foundData) { return false }
            return true;
        });

        return foundData;
    }

    private makeDataResurcive(arrayData: any[], level: number) {
        arrayData.forEach(mainRow => {
            mainRow.level = level;
            if (mainRow.childrens.length > 0 && mainRow.expanded && this.showBlankForExpanded) {
                mainRow = { ...mainRow, ...this.blankForExpandedObject }
            }
            this.rowDataExpanded.push(mainRow);
            if (mainRow.expanded) {
                this.makeDataResurcive(mainRow.childrens, level + 10)
            }
        })
    }

    private addIdInDataResurcive(arrayData: any[]) {
        arrayData.forEach(mainRow => {
            mainRow.customId = idCount;
            idCount++;
            this.addIdInDataResurcive(mainRow.childrens);
        })
    }
}