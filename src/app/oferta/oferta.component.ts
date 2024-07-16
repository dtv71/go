import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import { AgGrid, ColDef, Renderers } from '../controls';
import { ToastrService } from 'ngx-toastr';
import { NumericContainer } from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-oferta',
  templateUrl: './oferta.component.html',
  styleUrl: './oferta.component.css'
})
export class OfertaComponent implements OnInit {
  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService, private dialog: DialogService, private log: ToastrService) { }

  grid: AgGrid
  searchText
  id_ofprod
  id_prod
  //listacategorii
  listaoferte
  statusCurent

  colCategorii = [
    { property: "nume", class: "col-12" },
  ]

  ngOnInit(): void {
    this.searchText = ""
    this.id_ofprod = this.activatedRoute.snapshot.paramMap.get('id_ofprod') || "";
    this.id_prod = this.activatedRoute.snapshot.paramMap.get('id_prod') || "";
    this.setupGrid()
    this.getOferte()
  }

  setupGrid() {
    var colDefs: ColDef[] = [
      //{ headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Nr. oferta', field: 'id' },
      { headerName: 'Data oferta', field: 'data_oferta' },
      { headerName: 'Nume oferta', field: 'nume' },
      { headerName: 'User', field: 'utilizator' },
      { headerName: 'Client', field: 'numeprenume' },
      { headerName: 'Specialitate', field: 'spec_med' },
      { headerName: 'Tip', field: 'tipcontact' },
      { headerName: 'Functie', field: 'functiecontact' },
      { headerName: 'Unitate', field: 'unitate' },
      { headerName: 'Judet', field: 'jud_contact' },
      { headerName: 'Localitate', field: 'loc_contact' },
      { headerName: 'Strada', field: 'str_contact' },
      { headerName: 'Nr', field: 'nr_contact' },
      { headerName: 'Tel 1', field: 'tel1_contact' },
      { headerName: 'Email', field: 'email_contact' },
      { headerName: 'Pret fara TVA', field: 'pretftvaof', cellRenderer: Renderers.NumericDecimal  },
      { headerName: 'Pret vanzare', field: 'pretvanzareof', cellRenderer: Renderers.NumericDecimal},
      { headerName: 'Procent discount', field: 'procentdiscountof', cellRenderer: Renderers.NumericDecimal},
      { headerName: 'Valoare discount', field: 'valdiscountof', cellRenderer: Renderers.NumericDecimal},
      { headerName: 'Pret oferta', field: 'pretoferta', cellRenderer: Renderers.NumericDecimal},
      { headerName: 'Valuta', field: 'valuta', },
      { headerName: 'Prioritate', field: 'tipprioritate', },
      { headerName: 'Data demo', field: 'data_demo', },
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
      this.id_ofprod = this.grid.selectedRow.id_ofprod
      this.id_prod = this.grid.selectedRow.id_prod
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

  getOferte(id_prod?, id_contact?) {
    this.api.getOferte("", id_prod, id_contact).then((d) => {
      this.listaoferte = d
      this.grid.setDataSource(this.listaoferte).then(() => {
        this.grid.gridOptions.api.forEachNode(node => {
          if (node.data.id_ofprod == this.id_ofprod) {
            node.setSelected(true);
          }
        });
      })
    })
  }

  visibleButton() { return true }

  edit(id_prod, id_categorie) {
    // this.dialog.custom(ProdusEditModal, { id_prod: id_prod, id_categorie: id_categorie }, { size: 'xl', backdrop: false }).result.then((d) => {
    //   this.id_prod = d
    //   this.getProduse();
    // })
  }
  sterge(id_categorie) { }
  
  schimbaStatus() {
    // var statusNou = 0

    // if (this.statusCurent == 0) {
    //   statusNou = 1
    // }
    // var msg = this.statusCurent == 0 ? 'Doriti sa dezactivati produsul?' : 'Doriti sa activati produsul?'
    // this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
    //   var status = {
    //     tabel: 'prod_go',
    //     campstatus: 'is_inactiv',
    //     valstatus: statusNou,
    //     campid: 'id_prod',
    //     valid: this.id_prod

    //   }
    //   this.api.saveStatus(status).subscribe((result) => {
    //     this.log.success(result.toString())
    //     this.getProduse()
    //   })
    // })
  }

  exportCsv() { }

  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "sterge":
        if (this.id_ofprod) { disabled = false; } break;
      default:
        if (this.id_ofprod) { disabled = false }; break;
    }
  }

}
