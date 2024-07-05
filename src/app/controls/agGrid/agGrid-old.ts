import { ColDef } from "ag-grid-community";
import { AgGridController, AgGridColumnSize } from "./agGridController";

export class AgGrid extends AgGridController {
    constructor(columnDefs: ColDef[], chkBoxSelection?: boolean, isMultiSelect?: boolean, columnSize?: AgGridColumnSize) {
        super(columnDefs, columnSize, isMultiSelect);

        if (chkBoxSelection) {
            var col: ColDef = {
                headerName: '#', field: 'isSelected', cellClass: 'text-center',
                checkboxSelection: true, headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
            }
            columnDefs.unshift(col);
            //this.gridOptions.suppressRowClickSelection = true;
        }
        this.gridOptions.rowHeight = 30;
        this.gridOptions.defaultColDef!.sortable = true;
        this.gridOptions.onGridReady = (param) => this.onKeyPressed(param);
        this.gridOptions.navigateToNextCell = (param) => this.navigateToNextCell(param);
        this.gridOptions.onRowDoubleClicked = () => this.onRowDoubleClick();
        this.gridOptions.onColumnResized = (event) => {
            if (event.finished) { this.gridOptions.api && this.gridOptions.api.resetRowHeights() }
        }
    }

    private timer: any;

    onAddKey() { }
    onEditKey() { }
    onDeleteKey() { }
    onKeyPress(key: string) { }
    onRowDoubleClick() { }

    private onKeyPressed(param: any) {
        console.log('keypress')
        param.api.gridPanel.eAllCellContainers.forEach(container => {
            container.addEventListener('keydown', (evt) => {
                if (evt.key === 's' && evt.ctrlKey) {
                    evt.preventDefault();
                    return;
               }
            });
            container.addEventListener('keyup', (evt: KeyboardEvent) => {
                switch (evt.key) {
                    case 'a': if (evt.ctrlKey) { this.selectAll() }; break;
                    case 's': if (evt.ctrlKey) { this.exportAsCSV(param.api.gridPanel.eBodyViewport.baseURI) } break;
                    case 'c': if (evt.ctrlKey) { this.copy(evt) } break;
                    case 'Enter': this.onEditKey(); break;
                    case 'Delete': this.onDeleteKey(); break;
                    default: this.onKeyPress(evt.key); break;
                }

            });
        })
    }

    protected navigateToNextCell(params:any) {
        var KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;
        var previousCell = params.previousCellPosition;
        var suggestedNextCell = params.nextCellPosition;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        switch (params.key) {
            case KEY_UP: // return the cell above
                let prevRowIndex = previousCell.rowIndex - 1;
                if (prevRowIndex < -1) {
                    return null // returning null means don't navigate
                } else {
                    this.timer = setTimeout(() => { this.gridOptions.api!.selectIndex(prevRowIndex, false, false) }, 300);
                    return { rowIndex: prevRowIndex, column: previousCell.column, floating: previousCell.floating }
                }
            case KEY_DOWN: // return the cell below
                let nextRowIndex = previousCell.rowIndex + 1;
                var renderedRowCount = this.gridOptions.api!.getModel().getRowCount();
                if (nextRowIndex >= renderedRowCount) {
                    return null // returning null means don't navigate
                } else {
                    this.timer = setTimeout(() => { this.gridOptions.api!.selectIndex(nextRowIndex, false, false) }, 300);
                    return { rowIndex: nextRowIndex, column: previousCell.column, floating: previousCell.floating }
                }
            case KEY_LEFT:
            case KEY_RIGHT:
                return suggestedNextCell;
        }
    }

    private exportAsCSV(url: string) {
        url = url.substring(url.indexOf('#') + 1);
        // daca are jsonParam
        if (url.indexOf('/%') != -1) { url = url.substring(0, url.indexOf('/%')) }

        const split = url.split('/');
        let filename = 'export';
        if (split.length) {
            filename = '';
            for (const item of split) {
                if (item != '') { filename += `${item.charAt(0).toUpperCase()}${item.slice(1)}.` }
            }
            filename = filename.substring(0, filename.length - 1) + '.csv'
        }
        this.gridOptions.api && this.gridOptions.api.exportDataAsCsv({ fileName: filename, onlySelected: true })
    }
    private copy(container) {
       navigator.clipboard.writeText(container.target.textContent)

    }
    
}