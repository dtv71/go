import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGrid, ColDef, Renderers } from '../controls';
import { DialogService } from '../_services/dialog.service';
import { NomenclatorEdit } from './nomenclator.edit';

@Component({
  selector: 'app-nomenclator',
  templateUrl: './nomenclator.component.html',
  styleUrl: './nomenclator.component.css'
})
export class NomenclatorComponent implements OnInit {

  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private dialog: DialogService) { }


  grid: AgGrid
  userLogat
  listastatus
  tipstatus
  idstatus
  searchText: string = ""

  ngOnInit() {
    //this.tipstatus = this.activatedRoute.snapshot.paramMap.get('tipstatus') || "tipactivitate";
    this.setupGrid()
    this.activatedRoute.params.subscribe(params => {
      console.log(params['tipstatus'])
      this.tipstatus = params['tipstatus']

      this.getListaStatus()

    });
   

  }

  setActive(pagina) {
    var classTab = 'nav-link';
    if (this.tipstatus == pagina) classTab = 'nav-link active';
    return classTab;
  }

  getListaStatus() {
    this.idstatus = ''

    if (this.tipstatus == 'specmed') {
      this.api.getSpecMed(this.searchText).then((d) => {
        this.listastatus = d;
        this.grid.setDataSource(this.listastatus).then(() => {
          this.grid.gridOptions.api.forEachNode(node => {
            if (node.data.idspec_med == this.idstatus) {
              node.setSelected(true);
            }
          });
        })
      })
    } else {
      this.api.getNomenclatorByTip(this.searchText, this.tipstatus).then((d) => {
        this.listastatus = d;
        this.grid.setDataSource(this.listastatus).then(() => {
          this.grid.gridOptions.api.forEachNode(node => {
            if (node.data.idstatus == this.idstatus) {
              node.setSelected(true);
            }
          });
        })
      })
    }


  }

  setupGrid() {
    console.log(this.tipstatus)
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Nume', field: 'nume' },

    ];
    // if (this.tipstatus == "tipactivitate") {
    //   colDefs.push({ headerName: 'La client', field: 'isClient', cellRenderer: Renderers.Checkbox} )
    // }
    this.grid = new AgGrid(colDefs, false, false);
    this.grid.onDataLoaded = () => {
      this.grid.gridOptions.api.ensureIndexVisible(this.grid.gridOptions.api.getSelectedNodes()[0].rowIndex, null);
      this.idstatus = ''
    }

    this.grid.onAddKey = () => { }
    this.grid.onEditKey = () => { }
    this.grid.onDeleteKey = () => { }
    this.grid.onRowDoubleClick = () => {
      this.edit();
    }
    this.grid.onRowSelected = () => {
      this.idstatus = this.tipstatus == 'specmed' ? this.grid.selectedRow.idspec_med : this.grid.selectedRow.idstatus
    }

    this.grid.gridOptions.onSortChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }

    this.grid.gridOptions.onFilterChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }

    //this.grid.gridOptions.getRowStyle = (node) => {
    // if (node.data.is_platit == 0 && node.data.is_confirmat == 0) { return 'text-primary' }
    // if (node.data.is_platit == 0 && node.data.is_confirmat == 1) { return 'text-danger' }
    // if (node.data.is_platit == 1 && node.data.is_confirmat == 0) { return 'text-warning' }
    // if (node.data.tip == 'LECTOR') { return 'text-success' }
    //return { color: node.data.color }
    //}
  }

  add(){
    this.dialog.custom(NomenclatorEdit, { idstatus: '', tipstatus: this.tipstatus }, { size: 'md', backdrop: false }).result.then(() => {
      this.getListaStatus();
    })
  }
  edit() {
    this.dialog.custom(NomenclatorEdit, { idstatus: this.idstatus, tipstatus: this.tipstatus }, { size: 'md', backdrop: false }).result.then(() => {
      this.getListaStatus();
    })
  }
  sterge(idstatus) {

  }
  exportCsv() { }

  visibleButton() { return true }

  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "sterge":
        if (this.idstatus) { disabled = false; } break;
      default:
        if (this.idstatus) { disabled = false }; break;
    }
    return disabled
  }


}
