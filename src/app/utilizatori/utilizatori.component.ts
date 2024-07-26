import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import { AgGrid, ColDef, Renderers } from '../controls';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-utilizatori',
  templateUrl: './utilizatori.component.html',
  styleUrl: './utilizatori.component.css'
})
export class UtilizatoriComponent implements OnInit {
  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService, private dialog: DialogService, private log: ToastrService, private users: UserService) { }

  grid
  searchText
  iduser
  listauseri: User[]
  statusCurent
  adminCurent
  superCurent
  butonStatus: string = "Status"
  filt: string = "toti"
  listafilter = [
    { nume: "toti" },
    { nume: "activi" },
    { nume: "inactivi" },
  ]

  ngOnInit(): void {
    this.setupGrid()
    this.getUsers()

  }

  getUsers(id?) {
    this.users.getAll(this.searchText, id || "", this.filt || "inactivi").subscribe((d) => {
      this.listauseri = d
      this.grid.setDataSource(this.listauseri).then(() => {
        this.grid.gridOptions.api.forEachNode(node => {
          if (node.data.iduser == this.iduser) {
            node.setSelected(true);
          }
        });
      })
    })
  }

  setupGrid() {
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Nume', field: 'unume' },
      { headerName: 'Prenume', field: 'uprenume' },
      { headerName: 'Telefon', field: 'utel' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Creat', field: 'datauser', cellRenderer: Renderers.Date },
      { headerName: 'Last login', field: 'data_last_login', cellRenderer: Renderers.Date },
      { headerName: 'Admin', field: 'isadmin', cellRenderer: Renderers.Checkbox },
      { headerName: 'Supervizor', field: 'issupervizor', cellRenderer: Renderers.Checkbox },
      { headerName: 'Inactiv', field: 'is_inactiv', cellRenderer: Renderers.Checkbox },
      // { headerName: 'Media', field: 'url_media', cellRenderer: Renderers.Img  },

    ];
    this.grid = new AgGrid(colDefs, false, false);
    this.grid.gridOptions.getRowClass = (item) => {
      if (item.data.is_inactiv == 1) return 'text-warning'
      if (item.data.issupervizor == 1) return 'text-danger'

      if (item.data.isadmin == 1) return 'text-primary'
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
      this.iduser = this.grid.selectedRow.iduser
      this.statusCurent = this.grid.selectedRow.is_inactiv
      this.adminCurent = this.grid.selectedRow.isadmin
      this.superCurent = this.grid.selectedRow.issupervizor
      this.grid.gridOptions.api.ensureIndexVisible(this.grid.gridOptions.api.getSelectedNodes()[0].rowIndex);
    }

    this.grid.gridOptions.onSortChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }

    this.grid.gridOptions.onFilterChanged = () => {
      this.grid.gridOptions.api.refreshCells();
    }
  }

  schimbaStatus() {
    var statusNou = 0
    if (this.statusCurent == 0) {
      statusNou = 1
    }

    var msg = this.statusCurent == 0 ? 'Doriti sa dezactivati utilizatorul?' : 'Doriti sa activati utilizatorul?'
    this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
      var status = {
        tabel: 'users_ro',
        campstatus: 'is_inactiv',
        valstatus: statusNou,
        campid: 'iduser',
        valid: this.iduser

      }
      this.api.saveStatus(status).subscribe((result) => {
        this.log.success(result.toString())
        this.getUsers()
      })
    })
  }

  schimbaAdmin(){
    var adminNou = 0
    if (this.adminCurent == 0) {
      adminNou = 1
    }

    var msg = this.adminCurent == 0 ? 'Utilizatorul primeste drepturi de\n ADMIN?' : 'Utilizatorului i se revoca dreptul de\n ADMIN?'
    this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
      var status = {
        tabel: 'users_ro',
        campstatus: 'isadmin',
        valstatus: adminNou,
        campid: 'iduser',
        valid: this.iduser

      }
      this.api.saveStatus(status).subscribe((result) => {
        this.log.success(result.toString())
        this.getUsers()
      })
    })
  }
  
  schimbaSuper(){
    var superNou = 0
    if (this.superCurent == 0) {
      superNou = 1
    }

    var msg = this.superCurent == 0 ? 'Utilizatorul primeste drepturi de\n SUPERVIZOR?' : 'Utilizatorului i se revoca dreptul de\n SUPERVIZOR?'
    this.dialog.confirm({ message: msg, confirmBtn: 'Da', cancelBtn: 'Nu' }).then(() => {
      var status = {
        tabel: 'users_ro',
        campstatus: 'issupervizor',
        valstatus: superNou,
        campid: 'iduser',
        valid: this.iduser

      }
      this.api.saveStatus(status).subscribe((result) => {
        this.log.success(result.toString())
        this.getUsers()
      })
    })
  }


  add() {

  }

  edit() {

  }

  visibleButton() { return true }

  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "dezactiveaza":
        if (this.iduser) { disabled = false; } break;
      default:
        if (this.iduser) { disabled = false }; break;
    }
    return disabled
  }

}
