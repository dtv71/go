import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef, RowNode, Column } from 'ag-grid-community';
//import { DataService, LogService, IQueryRequest } from 'core';
import { GridInjector } from '../agGrid.module';

export enum AgGridSaveMode { Manual, CellChange, RowChange }
export enum AgGridSearchMode { StartsWith, Contains, Equals, None }
export enum AgGridColumnSize { None, Auto, ToFit, Resize }

export abstract class AgGridController {
    constructor(columnDefs: ColDef[], columnSize?: AgGridColumnSize, isMultiSelection?: boolean, private log?: ToastrService) {
          this.log = GridInjector.get(ToastrService);
        //  this.data = GridInjector.get(DataService);

        this.gridOptions = {
            // rowData: [],
            rowHeight: 25,
            headerHeight: 30,
            animateRows: true,
            columnDefs: columnDefs,
            rowSelection: isMultiSelection ? 'multiple' : 'single',
            defaultColDef: { filter: true, resizable: true, headerCheckboxSelectionFilteredOnly: true },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">În așteptare...</span>',
            overlayNoRowsTemplate: '<span>Nu sunt date.</span>',
            onRowDataChanged: (event) => {
                this.gridOptions.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">În așteptare...</span>';

                if (columnSize === AgGridColumnSize.ToFit) {
                    this.sizeColumnsToFitIfNecessary()
                } else if (columnSize === AgGridColumnSize.Resize) {
                    this.autoResizeColumns()
                } else if (columnSize !== AgGridColumnSize.None) {
                    this.autoSizeColumns()
                }
                this.onDataLoaded(event);
            },
            onRowSelected: (event) => {
                if (event.node.isSelected()) {
                    this.onRowSelected(event.node);
                    // if (this.timer) { clearTimeout(this.timer); this.timer = undefined; }
                    // this.timer = setTimeout(() => { this.onRowSelected(node) }, 350);
                }
            }
        }
    }

    // protected timer;
    gridOptions: GridOptions;
    // protected log: LogService;
    // protected data: DataService;
    // protected entityName: string;
    // protected query: IQueryRequest | any[];
    protected query!: Promise<any[]> | JSON | any[]


    private searchObj = { lastIdx: -1, currentIdx: -1, previousSearchText: '' };

    onDataLoaded(event: any) { }
    onRowSelected(rowNode: RowNode) { }
    isRowSelectable(rowNode: RowNode): boolean { return true }

    protected parseData(data: any[]): any[] | Promise<any[]> { return data }
    set dataSource(query: Promise<any[]> | JSON | any[]) { this.setDataSource(query) }
    setDataSource(query?: Promise<any[]> | JSON | any[], typeName?: string) {
        this.gridOptions.overlayLoadingTemplate = '<span class="ag-overlay-loading-center"><i class="fa fa-spinner fa-spin fa-pulse"></i>&nbsp;Incarcare date...</span>';

        return this.getDate(query, typeName).then(this.parseData).then(data => {
            if (!this.gridOptions.api) {
                this.gridOptions.rowData = data
            } else {
                this.gridOptions.api.showLoadingOverlay();
                this.gridOptions.rowData = data;
                this.gridOptions.api.setRowData(data);
            }
            return data
        })
    }
    private getDate(query: Promise<any[]> | JSON | any[], entityName?: string) {
        if (Array.isArray(query)) {
            return Promise.resolve(query)
        } else if (query) {
            // if (entityName) { this.data['manager'].clear() }
            // return this.data.executeQuery(query, entityName)
            return Promise.resolve([])
        
        } else {
            return Promise.resolve([])
        }
    }

    get rowData(): any[] { return this.gridOptions.rowData || [] }
    get rowCount(): number {
        return this.gridOptions.api && this.gridOptions.api.getModel().getRowCount() || 0
    }
    get rowCountData(): number { return this.gridOptions.rowData && this.gridOptions.rowData.length || 0 }
    get rowCountForEach(): number {
        let rowData = [];
        this.gridOptions.api && this.gridOptions.api.forEachNode(node => rowData.push(node.data));
        return rowData.length || 0;
    }

    setLoading() { this.gridOptions.api && this.gridOptions.api.showLoadingOverlay() }
    clearData() { this.gridOptions.api && this.gridOptions.api.setRowData([]) }

    getSelectedRows() { return this.gridOptions.api && this.gridOptions.api.getSelectedRows() || [] }
    getSelectedNodes() { return this.gridOptions.api && this.gridOptions.api.getSelectedNodes() || [] }

    deselectAll() { this.gridOptions.api!.deselectAll() }
    selectAll() {
        const temp = this.gridOptions.onRowSelected;
        this.gridOptions.onRowSelected = undefined;
        this.gridOptions.api.selectAll();
        this.gridOptions.onRowSelected = temp;
    }

    get selectedRow() {
        var row = this.getSelectedRows();
        return row && row[0] || {};
    }
    get selectedNode() {
        var node = this.getSelectedNodes();
        return node && node[0];
    }

    /** if rowData is null -> removes selected rows */
    removeRow(rowData?: any) {
        return this.gridOptions.api!.applyTransaction({ remove: rowData ? [rowData] : this.getSelectedRows() })
    }

    selectNode(value: number, property?: string, expandNode?: boolean) {
        if (!value) { return }
        this.gridOptions.api && this.gridOptions.api.forEachNode(node => {
            if (node.data[property || 'id'] == value) {
                node.setSelected(true);
                this.gridOptions.api!.ensureNodeVisible(node);

                if (expandNode) {
                    node.expanded = true;
                    while (node.parent) {
                        node.parent.expanded = true;
                        node = node.parent;
                    }
                    this.gridOptions.api!.onGroupExpandedOrCollapsed(node.rowIndex);
                }
            }
        })
    }

    quickFilter(searchText: string) {
        this.gridOptions.api && this.gridOptions.api.setQuickFilter(searchText);
    }
    filter(searchText: string, properties: string[], searchMode?: AgGridSearchMode) {
        this['searchRegExp'] = new RegExp((searchMode == AgGridSearchMode.StartsWith ? '^' : '') + searchText, 'i');
        if (!this.gridOptions.isExternalFilterPresent) {
            this.gridOptions.isExternalFilterPresent = () => { return true };
            this.gridOptions.doesExternalFilterPass = (node: RowNode) => {
                return properties.some(p => this['searchRegExp'].test(node.data[p]))
            }
        }
        this.gridOptions.api!.onFilterChanged();
    }
    search(searchText: string, properties: string[], searchMode: AgGridSearchMode = AgGridSearchMode.StartsWith) {
        if (searchText == '') return;

        if (searchText != this.searchObj.previousSearchText) { this.searchObj.lastIdx = -1 }
        this.searchObj.previousSearchText = searchText;

        var node = this.getNodeByProps(searchText, properties, this.searchObj.lastIdx + 1, searchMode);
        this.searchObj.previousSearchText = searchText;
        if (this.searchObj.currentIdx == -1) {
            if (this.searchObj.lastIdx == -1) {
                this.log!.info(`Nu s-a găsit niciun rezultat pentru: ${searchText}!`)
            } else {
                this.log!.info("Căutarea s-a finalizat fără alte rezultate!")
            }
        } else {
            this.selectNode(node.data.id, "", true)
        }
        this.searchObj.lastIdx = this.searchObj.currentIdx;
    }

    refreshCells(rowNode?: RowNode[], columns?: (string | Column)[], force?: boolean) {
        this.gridOptions.api!.refreshCells({ rowNodes: rowNode, columns: columns, force: force })
    }
    redrawRows(rowNode?: RowNode[], columns?: (string | Column)[], force?: boolean) {
        var row = rowNode && { rowNodes: rowNode, columns: columns, force: force };
        this.gridOptions.api!.redrawRows(row);
    }

    private getNodeByProps(searchText: string, properties: string[], startIdx: number, searchMode?: AgGridSearchMode) {
        var clearText = searchText.toLowerCase()//.replaceDiacritics();

        var result: any;
        this.gridOptions.api!.forEachNode(node => {
            if (node.childIndex == startIdx)
                for (var j = 0; j < properties.length; j++) {
                    if (node.data.hasOwnProperty(properties[j])) {
                        switch (searchMode) {
                            case AgGridSearchMode.Equals:
                                if (node.data[properties[j] || ''].toLowerCase() == clearText) result = node;
                                break;
                            case AgGridSearchMode.Contains:
                                if ((node.data[properties[j]] || '').toLowerCase().indexOf(clearText) != -1) result = node;
                                break;
                            case AgGridSearchMode.StartsWith:
                                if ((node.data[properties[j]] || '').toLowerCase().indexOf(clearText) == 0) result = node;
                                break;
                        }
                        if (result) {
                            this.searchObj.currentIdx = node.rowIndex || 0;
                            return true;
                        }
                    }
                }
        });

        if (!result) { this.searchObj.currentIdx = -1 }
        return result;
    }
    private sizeColumnsToFitIfNecessary() {
        const panel = this.gridOptions.api['gridPanel'];
        if (panel) {
            var viewportWidth: number = panel.eCenterViewport.getBoundingClientRect().width;
            var containerWidth: number = panel.eCenterContainer.getBoundingClientRect().width;
            if (containerWidth < viewportWidth) { this.gridOptions.api!.sizeColumnsToFit() }
        }
    }
    private autoSizeColumns() {
        var allColumnIds: any[] = [];
        if (this.gridOptions.columnApi && this.gridOptions.columnApi.getAllColumns()) {
            this.gridOptions.columnApi!.getAllColumns()!.forEach(function (column) {
                var colDef = column.getColDef();
                // if (!colDef.suppressSizeToFit && !colDef.suppressResize)
                //     allColumnIds.push(<never>column.getId())
            })
        }
        this.gridOptions.columnApi && this.gridOptions.columnApi.autoSizeColumns(allColumnIds)
    }
    private autoResizeColumns() {
        if (this.gridOptions.columnApi && this.gridOptions.columnApi.getAllColumns()) {
            this.gridOptions.columnApi!.getAllColumns()!.forEach((column) => {
                var colDef = column.getColDef();
                if (colDef.autoHeight && colDef.width) {
                    const viewportWidth: number = this.gridOptions.api['gridPanel'].eCenterViewport.getBoundingClientRect().width;
                    this.gridOptions.columnApi!.setColumnWidth(column, (viewportWidth * colDef.width) / 100)
                }
            })
        }
        this.gridOptions.api && this.gridOptions.api.resetRowHeights()
    }
}