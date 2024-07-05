import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ColDef } from 'ag-grid-community';
import { AgGrid } from '../controls/agGrid/agGrid';
import { DialogService } from '../_services/dialog.service';
import { CompanieEditModal } from './companie.edit.modal';

@Component({
  selector: 'app-companie',
  templateUrl: './companie.component.html',
  styleUrl: './companie.component.css'
})
export class CompanieComponent implements OnInit {
  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private auth: AuthenticationService, private dialog: DialogService) { }
  

  grid: AgGrid
  searchText: string
  id_ent_med
  listaentmed
  idtip_ent_med
  ord: string
  limit: number = 1000

  ngOnInit(): void {
    this.searchText = ""
    this.id_ent_med = this.activatedRoute.snapshot.paramMap.get('id_ent_med') || "";
    this.getEntMed()
    this.setupGrid()
  }

  setupGrid(){
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      //{ headerName: 'Data', field: 'data_activitate', cellRenderer: Renderers.Date, width: 100 },
      { headerName: 'Unitate', field: 'nume' },
      { headerName: 'CUI', field: 'cui' },
      { headerName: 'Tip', field: 'tipentitatemedicala' },
      { headerName: 'Tara', field: 'idtara' },
      { headerName: 'Judet', field: 'jud' },
      { headerName: 'Localitate', field: 'loc' },
      { headerName: 'Strada', field: 'strada' },
      { headerName: 'Numar', field: 'numar' },
      { headerName: 'Bloc', field: 'bloc' },
      { headerName: 'Apartament', field: 'ap' },
      { headerName: 'Cod postal', field: 'cp' },
      { headerName: 'Tel 1', field: 'tel1' },
      { headerName: 'Tel 2', field: 'tel2' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Site', field: 'site' },
      { headerName: 'Utilizator', field: 'utilizator' },
      
    ];
    this.grid = new AgGrid(colDefs, false, false);
    this.grid.onDataLoaded = () => {  }
    this.grid.onRowSelected = () => {
      this.id_ent_med = this.grid.selectedRow.id_ent_med;
      this.grid.gridOptions.api.ensureIndexVisible(this.grid.gridOptions.api.getSelectedNodes()[0].rowIndex, null);
    }
  }

  getEntMed() {
    const iduser = this.auth.currentUserValue.iduser
    const tipuser = this.auth.currentUserValue.isadmin == 1 ? 'admin' : 'user'
    
    this.api.fdbGetEntMed(this.searchText, this.id_ent_med, this.idtip_ent_med, iduser, tipuser, this.ord || '', this.limit ).then((d) => {
      this.listaentmed = d
      //console.log(this.listaentmed)
      this.grid.setDataSource(this.listaentmed).then(() => {
        this.grid.gridOptions.api.forEachNode(node => {
          if (node.data.id_ent_med == this.id_ent_med) {
            node.setSelected(true);
          }
        });
      })
    })
  }

  visibleButton() { return true }

  edit(id_ent_med) {
    //this.router.navigate(['./companie.edit', id_contact]);
    this.dialog.custom(CompanieEditModal, { id_ent_med: id_ent_med}, { size: 'xl', backdrop: false }).result.then(() => {
      this.getEntMed();
    })

  }
  sterge(id_contact) { }
  exportCsv() { }
  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "sterge":
        if (this.id_ent_med) { disabled = false; } break;
      default:
        if (this.id_ent_med) { disabled = false }; break;
    }
  }

}
