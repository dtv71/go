import { Component, Input, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { UtilsService } from "../_services/utils.service";
import { AppConfiguration } from "../_services/app-config.service";
import { EntMed, Prodcat, Produse } from "../_models/_numeris";
import { NgbDate, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";
import { Valuta } from '../_enums/nomenclator';
import { ColDef } from "ag-grid-community";
import { AgGrid, Renderers } from "../controls";


@Component({
    selector: 'produse-add-accesoriu',
    templateUrl: 'produse.add.accesoriu.html',
})

export class ProdusAddAccesoriu implements OnInit {
    constructor(public activeModal: NgbActiveModal, private apiService: ApiService, private log: ToastrService, private router: Router, private auth: AuthenticationService,
        private utils: UtilsService, private appconfig: AppConfiguration, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

    @Input() id_prod_parent

    grid: AgGrid
    produseForAccesorii
    id_categorie
    searchText

    ngOnInit() {
        this.setupGrid()
        this.getProduseForAccesorii()

    }

    listacategorii: any = (search) => {
        return this.apiService.fdbGetCategoriiProduse(search, this.id_categorie || "");
    }

    setupGrid() {
        var colDefs: ColDef[] = [
            { headerName: 'Nume', field: 'nume_prod', checkboxSelection: true, headerCheckboxSelection: true, },
            { headerName: 'Pret fara TVA', field: 'pretftva', cellRenderer: Renderers.NumericDecimal },
            { headerName: 'Valoare TVA', field: 'valtva', cellRenderer: Renderers.NumericDecimal },
            { headerName: 'Pret vanzare', field: 'pretvanzare', cellRenderer: Renderers.NumericDecimal },
            { headerName: 'Categorie', field: 'numecategorie' },
            { headerName: 'Producator', field: 'numeproducator' },
        ];
        this.grid = new AgGrid(colDefs, false, true);
        this.grid.onDataLoaded = () => {
            //this.gridDetaliu.gridOptions.api.sizeColumnsToFit();
            var allColumnIds = [];
            this.grid.gridOptions.columnApi.getAllColumns().forEach(function (column) {
                allColumnIds.push(column.getColId());
            });

           //this.grid.gridOptions.api.getRenderedNodes().forEach(function (node: any) {
                // if (node.data.s_idechipa) {
                //     node.setSelected(true);
                // }
            //});

            this.grid.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
        }
        this.grid.onRowSelected = () => {
        }
    }

    getProduseForAccesorii() {
        this.apiService.fdbGetProduseForAccesorii(this.id_prod_parent, this.id_categorie, this.searchText).then((d) => {
            this.produseForAccesorii = d
            this.grid.setDataSource(this.produseForAccesorii).then(() => {
                //     this.grid.gridOptions.api.forEachNode(node => {
                //       if (node.data.id_prod == this.id_prod) {
                //         node.setSelected(true);
                //       }
                //     });
            })
        })
    }

    save() {
        var msgErr = ""
        var listaIds = "";
        const ids = this.grid.getSelectedRows().map(r => r.id_prod);
        console.log(ids);
        for (var i = 0; i < ids.length; i++) {
            listaIds += "'" + ids[i] + "',";
        }
        listaIds = listaIds.slice(0, -1);

        this.apiService.fdbSaveAccesorii(this.id_prod_parent, listaIds).subscribe(()=>{
            this.activeModal.close();
        })
    }

    isDisabled() {
        return false
    }
}