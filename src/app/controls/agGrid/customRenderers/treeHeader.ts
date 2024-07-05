import { IHeaderGroup } from "ag-grid-community";

export class TreeHeader implements IHeaderGroup {

    private eIcon: HTMLElement;
    private eHeader = document.createElement('span');

    getGui() { return this.eHeader }
    destroy() {
        this.eIcon.removeEventListener('click', this.onClick)
    }
    init(params) {
        this.eIcon = document.createElement('i');
        this.eIcon.className = !params.isExpandedAll ? 'far fa-fw fa-plus-square' : 'far fa-fw fa-minus-square';
        this.eIcon.addEventListener('click', this.onClick.bind(this, params));

        this.eHeader.appendChild(this.eIcon);
        this.eHeader.appendChild(document.createTextNode(params.displayName));
    }
    onClick(params) {
        params.isExpandedAll = !params.isExpandedAll;
        this.eIcon.className = !params.isExpandedAll ? 'far fa-fw fa-plus-square' : 'far fa-fw fa-minus-square';
        params.isExpandedAll ? params.api.expandAll() : params.api.collapseAll();
    }
}