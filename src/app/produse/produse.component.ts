import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import { AgGrid, ColDef, Renderers } from '../controls';
import { ToastrService } from 'ngx-toastr';
import { ProdusEditModal } from './produs.edit.modal';
import { ProdusAddAccesoriu } from './produse.add.accesoriu';

@Component({
  selector: 'app-produse',
  templateUrl: './produse.component.html',
  styleUrl: './produse.component.css'
})
export class ProduseComponent implements OnInit {
  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService, private dialog: DialogService, private log: ToastrService) { }

  grid: AgGrid
  gridAccesorii: AgGrid
  searchText
  id_prod
  id_categorie
  listaaccesorii
  listaproduse
  statusCurent
  url_media

  colCategorii = [
    { property: "nume", class: "col-12" },
  ]

  ngOnInit(): void {
    this.searchText = ""
    this.id_prod = this.activatedRoute.snapshot.paramMap.get('id_produs') || "";
    this.id_categorie = this.activatedRoute.snapshot.paramMap.get('id_categorie') || "";
    this.setupGrid()
    this.getProduse()
    this.setupGridAccesorii()
  }

  setupGrid() {
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Nume', field: 'nume_prod' },
      { headerName: 'Categorie', field: 'numecategorie' },
      { headerName: 'Producator', field: 'numeproducator' },
      { headerName: 'Pret fara TVA', field: 'pretftva', cellRenderer: Renderers.NumericDecimal },
      { headerName: 'Valoare TVA', field: 'valtva', cellRenderer: Renderers.NumericDecimal },
      { headerName: 'Pret vanzare', field: 'pretvanzare', cellRenderer: Renderers.NumericDecimal },
      { headerName: 'Procent discount', field: 'procentdiscount', cellRenderer: Renderers.NumericDecimal },
      { headerName: 'Valoare discount', field: 'valdiscount', cellRenderer: Renderers.NumericDecimal },
      { headerName: 'Pret cu discount', field: 'pretcudiscount', cellRenderer: Renderers.NumericDecimal },
      { headerName: 'Valuta', field: 'valuta', },
      { headerName: 'Inactiv', field: 'is_inactiv', cellRenderer: Renderers.Checkbox },
      // { headerName: 'Media', field: 'url_media', cellRenderer: Renderers.Img  },

    ];
    this.grid = new AgGrid(colDefs, false, false);
    this.grid.gridOptions.getRowClass = (item) => {
      if (item.data.is_inactiv == 1)
        return 'text-warning'
    }
    this.grid.onDataLoaded = () => {

    }

    this.grid.onAddKey = () => { }
    this.grid.onEditKey = () => { }
    this.grid.onDeleteKey = () => { }
    this.grid.onRowDoubleClick = () => {
      //this.edit(this.id_contact);
    }
    this.grid.onRowSelected = () => {
      //this.id_categorie = this.grid.selectedRow.id_categorie
      this.id_prod = this.grid.selectedRow.id_prod
      this.statusCurent = this.grid.selectedRow.is_inactiv
      this.url_media = this.grid.selectedRow.url_media || ""
      this.grid.gridOptions.api.ensureIndexVisible(this.grid.gridOptions.api.getSelectedNodes()[0].rowIndex);
      this.getAccesoriiForProdus()
    }

    this.grid.gridOptions.onSortChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }

    this.grid.gridOptions.onFilterChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }
  }

  setupGridAccesorii() {
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Nume', field: 'numeprodus' },
      { headerName: 'Pret fara TVA', field: 'pretftva', cellRenderer: Renderers.NumericDecimal },
      { headerName: 'Valoare TVA', field: 'valtva', cellRenderer: Renderers.NumericDecimal },
      { headerName: 'Pret vanzare', field: 'pretvanzare', cellRenderer: Renderers.NumericDecimal },
      { headerName: 'Categorie', field: 'numecategorie' },
      { headerName: 'Producator', field: 'numeproducator' },
      //{ headerName: 'Id', field: 'id' },

    ];
    this.gridAccesorii = new AgGrid(colDefs, false, false);
  }

  getAccesoriiForProdus() {
    this.api.fdbGetAccesoriiForProdus("", this.id_prod).then((d) => {
      this.listaaccesorii = d
      this.gridAccesorii.setDataSource(this.listaaccesorii).then(() => {
        // this.grid.gridOptions.api.forEachNode(node => {
        //   if (node.data.id_prod == this.id_prod) {
        //     node.setSelected(true);
        //   }
        // });
      })
    })
  }

  listacategorii: any = (search) => {
    return this.api.fdbGetCategoriiProduse(search, this.id_categorie || "");
  }

  getProduse() {
    this.api.fdbGetProduse(this.searchText, this.id_categorie).then((d) => {
      this.listaproduse = d
      this.grid.setDataSource(this.listaproduse).then(() => {
        this.grid.gridOptions.api.forEachNode(node => {
          if (node.data.id_prod == this.id_prod) {
            node.setSelected(true);
          }
        });
      })
    })

  }

  visibleButton() { return true }

  edit(id_prod, id_categorie) {
    this.dialog.custom(ProdusEditModal, { id_prod: id_prod, id_categorie: id_categorie }, { size: 'xl', backdrop: false }).result.then((d) => {
      this.id_prod = d
      this.getProduse();
    })
  }
  sterge(id_categorie) { }
  schimbaStatus() {
    var statusNou = 0

    if (this.statusCurent == 0) {
      statusNou = 1
    }
    var msg = this.statusCurent == 0 ? 'Doriti sa dezactivati produsul?' : 'Doriti sa activati produsul?'
    this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
      var status = {
        tabel: 'prod_go',
        campstatus: 'is_inactiv',
        valstatus: statusNou,
        campid: 'id_prod',
        valid: this.id_prod

      }
      this.api.saveStatus(status).subscribe((result) => {
        this.log.success(result.toString())
        this.getProduse()
      })
    })
  }

  exportCsv() { }

  eliminaAccesoriu() {
    let id_accesoriu = this.gridAccesorii.selectedRow.id_accesoriu
    this.dialog.confirm({
      message: 'Doriti sa eliminati accesoriul?', confirmBtn: 'Sterge', cancelBtn: 'Renunta'
    }).then(() => {
      this.api.deleteElementById('accesoriu_go', 'id_accesoriu', id_accesoriu, 1).subscribe(() => {
        this.getAccesoriiForProdus()
      })
    })
  }
  addAccesoriu() {
    this.dialog.custom(ProdusAddAccesoriu, { id_prod_parent: this.id_prod }, { size: 'xl', backdrop: false }).result.then((d) => {
      this.getAccesoriiForProdus();
    })
  }

  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "sterge":
      case "addAccesoriu":
        if (this.id_prod) { disabled = false; } break;
      case "eliminaAccesoriu":
        if (this.gridAccesorii.selectedRow && this.gridAccesorii.selectedRow.id_accesoriu) { disabled = false; } break;
      default:
        if (this.id_prod) { disabled = false }; break;
    }
    return disabled
  }

}
