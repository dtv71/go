import { ColDef } from "ag-grid-community";
import { AgGridColumnSize, AgGridController } from "./agGridController";
import { TreeHeader } from './customRenderers/treeHeader';
import { TreeDataCellRenderer } from "./customRenderers/treeData";

export class AgGridTree extends AgGridController {
    constructor(columnDefs: ColDef[], protected isAllExpanded?: boolean, columnSize?: AgGridColumnSize) {
        super(columnDefs, columnSize);

        columnDefs[0].showRowGroup = true;
        columnDefs[0].cellRenderer = 'agGroupCellRenderer';

        if (!columnDefs[0].headerComponent) { columnDefs[0].headerComponent = TreeHeader }
        if (!columnDefs[0].cellRendererParams) {
            columnDefs[0].cellRendererParams = { checkbox: true }
        } else {
            columnDefs[0].cellRendererParams.checkbox = true
        }
        // columnDefs[0].cellRendererParams.innerRenderer = TreeDataCellRenderer;
        //this.gridOptions.icons = { // override icons
        //    groupExpanded: '<i data-ignore-click="true" class="fa fa-minus-square-o" />',
        //    groupContracted: '<i data-ignore-click="true" class="fa fa-fw fa-plus-square-o" />'
        //};

        /** override default click (default does not select node if leafs attached) */
        this.gridOptions.onRowClicked = (params) => {
            if (params.node.allChildrenCount && params.node.allChildrenCount > 0) {
                var select = true;
                var clearSelection = true;
                if (params.event && params.event['ctrlKey']) {
                    select = !params.node.isSelected();
                    clearSelection = false;
                }
                params.node.setSelected(select, clearSelection);
            }
        }
        this.gridOptions.onRowGroupOpened = this.onGridRowExpanded.bind(this);
       /** 
        this.gridOptions.getNodeChildDetails = (item) => {
            return {
                group: item.group || !!item.children,
                expanded: item.hasOwnProperty('expanded') ? item.expanded : isAllExpanded || false,
                children: item.children,
                // master: item.master,
                // field: item.field,
                // key: item.headerName,
            }
        }
        
        */
    }

    onGridRowExpanded() { }
    setTreeLeafs(expanded: boolean) {
        this.gridOptions.api && (expanded
            ? this.gridOptions.api.expandAll()
            : this.gridOptions.api.collapseAll())
    }

    protected override parseData(data: any[]): any[] {
        console.log(data)
        const hierarchyId = 'hierarchyId', parentId = 'parentId';
        const lookup = {}, treeList = [];
        data.forEach(function (obj) { lookup[obj[hierarchyId]] = obj });
        data.forEach(function (obj) {
            if (obj[parentId] != "/") {
                const parent = obj[parentId];
                if (!lookup[parent]) {
                    treeList.push(obj)
                } else {
                    if (!lookup[parent].children) { lookup[parent].children = [] }
                    lookup[parent].children.push(obj);
                }
            } else { treeList.push(obj) }
        });
        data.forEach(function (obj) {
            const arr = lookup[obj[hierarchyId]].children;
            if (arr) lookup[obj[hierarchyId]].children = arr.sort((a, b) => {
                return a[hierarchyId].replace(/\//g, '') - b[hierarchyId].replace(/\//g, '')
            })
        });
        return treeList;
    }
}