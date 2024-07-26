import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import { AgGrid, ColDef, Renderers } from '../controls';
import { ToastrService } from 'ngx-toastr';
import { TipTva, Valuta } from '../_models/_numeris';
import { SetariGeneraleEdit } from './setarigenerale.edit';

@Component({
  selector: 'app-setarigenerale',
  templateUrl: './setarigenerale.component.html',
  styleUrl: './setarigenerale.component.css'
})
export class SetarigeneraleComponent implements OnInit {
  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService, private dialog: DialogService, private log: ToastrService) { }

  gridTipTva: AgGrid
  gridValuta: AgGrid
  searchText
  id_tiptva
  id_valuta
  mod: string = "tiptva"
  listatiptva
  listavaluta
  statusCurent


  ngOnInit(): void {
    this.searchText = ""
    this.setupGridTipTva()
    this.setupGridValuta()

    this.id_tiptva = this.activatedRoute.snapshot.paramMap.get('id_tiptva') || "";
    this.id_valuta = this.activatedRoute.snapshot.paramMap.get('id_valuta') || "";

    this.activatedRoute.params.subscribe(params => {
      console.log(params['tipstatus'])
      this.mod = params['mod']
      if (this.mod == 'tiptva') {
        this.id_valuta = ''
      } else {
        this.id_tiptva = ''
      }
      this.getLista()
    });
  }

  getLista() {
    if (this.mod == 'tiptva') {
      this.api.getTipTva(this.searchText).then((d) => {
        this.listatiptva = d;
        console.log(this.listatiptva)
        this.gridTipTva.setDataSource(this.listatiptva).then(() => {
          this.gridTipTva.gridOptions.api.forEachNode(node => {
            if (node.data.id_tiptva == this.id_tiptva) {
              node.setSelected(true);
            }
          });
        })
      })

    } else {
      this.api.getValuta(this.searchText).then((d) => {
        this.listavaluta = d;
        console.log(this.listavaluta)
        this.gridValuta.setDataSource(this.listavaluta).then(() => {
          this.gridValuta.gridOptions.api.forEachNode(node => {
            if (node.data.id_valuta == this.id_valuta) {
              node.setSelected(true);
            }
          });
        })
      })

    }

  }

  setupGridTipTva() {
    //console.log(this.tipstatus)
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Nume', field: 'nume' },
      { headerName: 'Procent', field: 'procent' },
      { headerName: 'Curent', field: 'is_curent', cellRenderer: Renderers.Checkbox },
      { headerName: 'Inactiv', field: 'is_inactiv', cellRenderer: Renderers.Checkbox },

    ];

    this.gridTipTva = new AgGrid(colDefs, false, false);
    this.gridTipTva.onDataLoaded = () => {
      this.gridTipTva.gridOptions.api.ensureIndexVisible(this.gridTipTva.gridOptions.api.getSelectedNodes()[0].rowIndex, null);
    }


    this.gridTipTva.onRowSelected = () => {
      this.id_valuta = ''
      this.id_tiptva = this.gridTipTva.selectedRow.id_tiptva
      this.statusCurent = this.gridTipTva.selectedRow.is_inactiv
    }

    this.gridTipTva.gridOptions.onSortChanged = () => {
      this.gridTipTva.gridOptions.api.refreshCells();
    }

    this.gridTipTva.gridOptions.onFilterChanged = () => {
      this.gridTipTva.gridOptions.api.refreshCells();
    }
    this.gridTipTva.gridOptions.getRowClass = (item) => {
      if (item.data.is_inactiv == 1) return 'text-warning'
      if (item.data.is_curent == 1) return 'text-success'
    }


  }

  setupGridValuta() {
    //console.log(this.tipstatus)
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Nume', field: 'nume' },
      { headerName: 'Curent', field: 'is_curent', cellRenderer: Renderers.Checkbox },
      { headerName: 'Inactiv', field: 'is_inactiv', cellRenderer: Renderers.Checkbox },

    ];

    this.gridValuta = new AgGrid(colDefs, false, false);
    this.gridValuta.onDataLoaded = () => {
      this.gridValuta.gridOptions.api.ensureIndexVisible(this.gridValuta.gridOptions.api.getSelectedNodes()[0].rowIndex, null);
    }


    this.gridValuta.onRowSelected = () => {
      this.id_tiptva = ''
      this.id_valuta = this.gridValuta.selectedRow.id_valuta
      this.statusCurent = this.gridValuta.selectedRow.is_inactiv
    }

    this.gridValuta.gridOptions.onSortChanged = () => {
      this.gridValuta.gridOptions.api.refreshCells();
    }

    this.gridValuta.gridOptions.onFilterChanged = () => {
      this.gridValuta.gridOptions.api.refreshCells();
    }
    this.gridValuta.gridOptions.getRowClass = (item) => {
      if (item.data.is_inactiv == 1) return 'text-warning'
      if (item.data.is_curent == 1) return 'text-success'
    }


  }

  setActive(pagina) {
    var classTab = 'nav-link';
    if (this.mod == pagina) classTab = 'nav-link active';
    return classTab;
  }

  setCurent() {
    if (this.mod == 'tiptva') {
      var msg = 'Doriti sa setati Tip TVA curent?'
      this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
        var status = {
          tabel: 'tiptva_go',
          campid: 'id_tiptva',
          valid: this.id_tiptva
        }
        this.api.setCurent(status).subscribe((result) => {
          this.log.success(result.toString())
          this.getLista()
        })
      })
    } else {
      var msg = 'Doriti sa setati valuta curenta?'
      this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
        var status = {
          tabel: 'valuta_go',
          campid: 'id_valuta',
          valid: this.id_valuta
        }
        this.api.setCurent(status).subscribe((result) => {
          this.log.success(result.toString())
          this.getLista()
        })
      })
    }
  }

  schimbaStatus() {
    var statusNou = 0
    if (this.statusCurent == 0) {
      statusNou = 1
    }
    if (this.mod == 'tiptva') {

      var msg = this.statusCurent == 0 ? 'Doriti sa dezactivati tipul de TVA?' : 'Doriti sa activati tipul de TVA?'
      this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
        var status = {
          tabel: 'tiptva_go',
          campstatus: 'is_inactiv',
          valstatus: statusNou,
          campid: 'id_tiptva',
          valid: this.id_tiptva

        }
        this.api.saveStatus(status).subscribe((result) => {
          this.log.success(result.toString())
          this.getLista()
        })
      })
    } else {
      var msg = this.statusCurent == 0 ? 'Doriti sa dezactivati valuta?' : 'Doriti sa activati valuta?'
      this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
        var status = {
          tabel: 'valuta_go',
          campstatus: 'is_inactiv',
          valstatus: statusNou,
          campid: 'id_valuta',
          valid: this.id_valuta

        }
        this.api.saveStatus(status).subscribe((result) => {
          this.log.success(result.toString())
          this.getLista()
        })
      })
    }
  }


  add() {
    this.dialog.custom(SetariGeneraleEdit, { id: '', mod: this.mod }, { size: 'md', backdrop: false }).result.then((d) => {
      if (this.mod == 'tiptva') {
        this.id_tiptva = d
        this.id_valuta = ''
      } else {
        this.id_tiptva = ''
        this.id_valuta = d
      }
      this.getLista();
    })
  }
  edit() {
    var id = this.id_tiptva
    if (this.mod == 'valuta') {
      id = this.id_valuta
    }
    this.dialog.custom(SetariGeneraleEdit, { id: id, mod: this.mod }, { size: 'md', backdrop: false }).result.then((d) => {
      this.getLista();
    })
  }

  exportCsv() {

  }

  visibleButton() { return true }

  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "sterge":
        if (this.mod) { disabled = false; } break;
      default:
        if (this.mod) { disabled = false }; break;
    }
    return disabled
  }

}
