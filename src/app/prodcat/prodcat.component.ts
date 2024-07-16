import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import { UserService } from '../_services/user.service';
import { ColDef } from 'ag-grid-community';
import { AgGrid } from '../controls/agGrid/agGrid';
import { Renderers } from '../controls';
import { ApiService } from '../_services/api.service';
import { ProdcatEditModal } from './prodcat.edit.modal';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-prodcat',
  templateUrl: './prodcat.component.html',
  styleUrl: './prodcat.component.css'
})
export class ProdcatComponent implements OnInit {
  constructor(
    private api: ApiService,
    private userService: UserService,
    private auth: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: DialogService, private log: ToastrService
  ) { }

  grid: AgGrid
  id_categorie
  listacategorii
  searchText
  statusCurent
  ngOnInit() {
    this.searchText = ''
    this.id_categorie = this.activatedRoute.snapshot.paramMap.get('id_categorie') || "";
    this.setupGrid()
    this.getCategorii()

  }

  setupGrid() {
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Nume', field: 'nume' },
      { headerName: 'Descriere', field: 'text_cat' },
      { headerName: 'Ordine', field: 'ord', },
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
      this.id_categorie = this.grid.selectedRow.id_categorie
      this.statusCurent = this.grid.selectedRow.is_inactiv
      this.grid.gridOptions.api.ensureIndexVisible(this.grid.gridOptions.api.getSelectedNodes()[0].rowIndex);
    }

    this.grid.gridOptions.onSortChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }

    this.grid.gridOptions.onFilterChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }
  }

  getCategorii() {
    this.api.fdbGetCategoriiProduse(this.searchText).then((d) => {
      this.listacategorii = d
      this.grid.setDataSource(this.listacategorii).then(() => {
        this.grid.gridOptions.api.forEachNode(node => {
          if (node.data.id_categorie == this.id_categorie) {
            node.setSelected(true);
          }
        });
      })
    })

  }

  visibleButton() { return true }

  edit(id_categorie) {
    this.dialog.custom(ProdcatEditModal, { id_categorie: id_categorie }, { size: 'md', backdrop: false }).result.then(() => {
      this.getCategorii();
    })
  }
  sterge(id_categorie) { }
  schimbaStatus() {
    var statusNou = 0

    if (this.statusCurent == 0) {
      statusNou = 1
    }
    var msg = this.statusCurent == 0 ? 'Doriti sa dezactivati categoria?' : 'Doriti sa activati categoria?'
    this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
      var status = {
        tabel: 'cat_go',
        campstatus: 'is_inactiv',
        valstatus: statusNou,
        campid: 'id_categorie',
        valid: this.id_categorie

      }
      this.api.saveStatus(status).subscribe((result)=>{
        this.log.success(result.toString())
        this.getCategorii()
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
