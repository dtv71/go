import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { CommonModule } from '@angular/common';
import { AgGrid } from '../controls/agGrid/agGrid';
import { ColDef } from 'ag-grid-community';
import { Grid, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Renderers } from '../controls';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-contact',

  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {

  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private auth: AuthenticationService, 
    private dialog: DialogService, private log: ToastrService) { }

  grid: AgGrid
  gridActivitate: AgGrid
  searchText: string = ''
  listacontacte
  listaactivitate
  id_contact
  tipTab: string = 'activitate'


  ngOnInit(): void {
    this.id_contact = this.activatedRoute.snapshot.paramMap.get('id_contact') || "";
    this.setupGrid()
    this.getContacte()
    this.setupGridActivitate()


  }

  setupGrid() {
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Data', field: 'data_contact', cellRenderer: Renderers.Date },
      //{ headerName: 'Titlu', field: 'titlucontact' },
      { headerName: 'Nume', field: 'nume_contact' },
      { headerName: 'Prenume', field: 'prenume_contact' },
      { headerName: 'Email', field: 'email_contact', },
      { headerName: 'Specialitate', field: 'spec_med', },
      { headerName: 'Functie', field: 'functiecontact', },
      { headerName: 'Tip', field: 'tipcontact', },
      { headerName: 'Observatii', field: 'obs_contact', },
      { headerName: 'Unitate', field: 'unitate', },
      { headerName: 'Ecograf', field: 'flag_ecograf', cellRenderer: Renderers.Checkbox },
      { headerName: 'Mod contact', field: 'contactat_cum' },
      { headerName: 'Interesat de', field: 'interesat_de' },
      //{ headerName: 'CUI', field: 'cui' },
      { headerName: 'Telefon', field: 'tel1_contact' },
      { headerName: 'Judet', field: 'jud_contact' },
      { headerName: 'Localitate', field: 'loc_contact' },
      { headerName: 'Strada', field: 'str_contact' },
      { headerName: 'Nr', field: 'nr_contact' },
      { headerName: 'Bl.', field: 'bl_contact' },
      { headerName: 'Ap.', field: 'ap_contact' },
      { headerName: 'Cod postal', field: 'cp_contact' },
      { headerName: 'Utilizator', field: 'utilizator' },
    ];
    this.grid = new AgGrid(colDefs, false, false);
    this.grid.onDataLoaded = () => {
      //this.gridDetaliu.gridOptions.api.sizeColumnsToFit();
      //   var allColumnIds: any = [];
      //   this.grid.gridOptions.columnApi!.getAllColumns()!.forEach(function (column) {
      //     allColumnIds.push(column.getColId());
      //   });
      //   this.grid.gridOptions.columnApi!.autoSizeColumns(allColumnIds, false);
    }

    this.grid.onAddKey = () => { }
    this.grid.onEditKey = () => { }
    this.grid.onDeleteKey = () => { }
    this.grid.onRowDoubleClick = () => {
      this.edit(this.id_contact);
    }
    this.grid.onRowSelected = () => {
      this.id_contact = this.grid.selectedRow.id_contact
      this.grid.gridOptions.api.ensureIndexVisible(this.grid.gridOptions.api.getSelectedNodes()[0].rowIndex, null);
      this.getActivitate()
    }

    this.grid.gridOptions.onSortChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }

    this.grid.gridOptions.onFilterChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }

    this.grid.gridOptions.getRowClass = (node) => {
      // if (node.data.is_platit == 0 && node.data.is_confirmat == 0) { return 'text-primary' }
      // if (node.data.is_platit == 0 && node.data.is_confirmat == 1) { return 'text-danger' }
      // if (node.data.is_platit == 1 && node.data.is_confirmat == 0) { return 'text-warning' }
      // if (node.data.tip == 'LECTOR') { return 'text-success' }
      return ''
    }


  }

  getContacte() {
    this.api.fdbGetContacte(this.searchText, "", 999912, 'c.data_contact DESC', '').then((d) => {

      this.listacontacte = d;
      this.grid.setDataSource(this.listacontacte).then(() => {
        this.grid.gridOptions.api.forEachNode(node => {
          if (node.data.id_contact == this.id_contact) {
            node.setSelected(true);
          }
        });
      })

    })
  }

  setupGridActivitate() {
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Data', field: 'data_activitate', cellRenderer: Renderers.Date, width: 100 },
      { headerName: 'Activitate', field: 'activitate' },
      { headerName: 'Observatii', field: 'obs' },
      { headerName: 'Utilizator', field: 'utilizator' },
    ];
    this.gridActivitate = new AgGrid(colDefs, false, false);
    this.gridActivitate.onDataLoaded = () => {  }
  }

  getActivitate() {
    const iduser = this.auth.currentUserValue.iduser
    const tipuser = this.auth.currentUserValue.isadmin == 1 ? 'admin' : 'user'
    this.api.fdbGetActivitateForContact("", this.id_contact, iduser, tipuser).then((d) => {
      this.listaactivitate = d
      console.log(this.listaactivitate)
      this.gridActivitate.setDataSource(this.listaactivitate).then(() => {
        // this.grid.gridOptions.api.forEachNode(node => {
        //   if (node.data.id_contact == this.id_contact) {
        //     node.setSelected(true);
        //   }
        // });
      })
    })
  }

  setActive(tipGrid) {
    var classTab = 'nav-link';
    if (this.tipTab == tipGrid) classTab = 'nav-link active';
    return classTab;
  }

  getGrid(tip){
    this.tipTab = tip
    
  }

  visibleButton() { return true }

  edit(id_contact) {
    this.router.navigate(['./contact.edit', id_contact]);
  }

 
  sterge(id_contact) { }
  exportCsv() { }
  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "sterge":
        if (this.id_contact) { disabled = false; } break;
      default:
        if (this.id_contact) { disabled = false }; break;
    }
  }
}
