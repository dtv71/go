import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import { AgGrid, ColDef, Renderers } from '../controls';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-produse',
  templateUrl: './produse.component.html',
  styleUrl: './produse.component.css'
})
export class ProduseComponent implements OnInit {
  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute, 
    private auth: AuthenticationService, private dialog: DialogService, private log: ToastrService) { }

  grid: AgGrid
  searchText
  id_prod
  id_categorie
  //listacategorii
  listaproduse
  statusCurent

  colCategorii = [
    { property: "nume", class: "col-12" },
]

  ngOnInit(): void {
    this.searchText = ""
    this.id_prod = this.activatedRoute.snapshot.paramMap.get('id_produs') || "";
    this.id_categorie = this.activatedRoute.snapshot.paramMap.get('id_categorie') || "";
    this.setupGrid()
    this.getProduse()
  }

  setupGrid() {
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Nume', field: 'nume_prod' },
      { headerName: 'Categorie', field: 'numecategorie' },
      { headerName: 'Producator', field: 'numeproducator' },
      { headerName: 'Pret fara TVA', field: 'pretftva', },
      { headerName: 'Valoare TVA', field: 'valtva', },
      { headerName: 'Pret vanzare', field: 'pretvanzare', },
      { headerName: 'Procent discount', field: 'procentdiscount', },
      { headerName: 'Valoare discount', field: 'valdiscount', },
      { headerName: 'Valuta', field: 'valuta', },
      { headerName: 'Inactiv', field: 'is_inactiv', cellRenderer: Renderers.Checkbox },

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
      this.grid.gridOptions.api.ensureIndexVisible(this.grid.gridOptions.api.getSelectedNodes()[0].rowIndex, 'middle');
    }

    this.grid.gridOptions.onSortChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }

    this.grid.gridOptions.onFilterChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }
  }

  getCategorii(){
    // this.api.fdbGetCategoriiProduse(this.searchText, this.id_categorie).then((d)=>{
    //   this.listacategorii = d
    // })
  }

  listacategorii: any = (search) => {
    return this.api.fdbGetCategoriiProduse(search, this.id_categorie || "");
}

  getProduse(){
    this.api.fdbGetProduse("", this.id_categorie).then((d)=>{
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

  edit(id_categorie) {
    // this.dialog.custom(ProdcatEditModal, { id_categorie: id_categorie }, { size: 'md', backdrop: false }).result.then(() => {
    //   this.getCategorii();
    // })
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
      this.api.saveStatus(status).subscribe((result)=>{
        this.log.success(result.toString())
        this.getProduse()
      })
    })
  }

  exportCsv() { }

  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "sterge":
        if (this.id_categorie) { disabled = false; } break;
      default:
        if (this.id_categorie) { disabled = false }; break;
    }
  }
}
