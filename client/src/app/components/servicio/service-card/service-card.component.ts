import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { ContratoService } from 'src/app/services/contrato.service';

import { Servicio } from 'src/app/models/Servicio';

declare var $: any;

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent {

  @Output() seleccionarCategoria = new EventEmitter();

  @Input() cardData: Servicio = {
    _id: '',
    titulo: '',
    descripcion: '',
    precio: {
      valor: 0,
      moneda: {
        tag: ''
      }
    },
    ubicacion: '',
    fechaHoraPublicacion: undefined,
    categoria: {
      _id: '',
      descripcion: '',
    },
    usuario: {
      _id: '',
      nombreUsuario: '',
      nombreApellido: '',
      email: '',
      nivel: {
        _id: '',
        nro: 0,
      }
    },
  };

  serviceDetailQuery: any;
  serviceDetailSubscription: any;

  constructor(
    private router: Router,
    public authService: AuthService,
    public userService: UserService,
    private servicioService: ServicioService,
    private contratoService: ContratoService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.serviceDetailSubscription) this.unsuscribeServiceDetail();
  }

  suscribeServiceDetail(): void {
    this.serviceDetailQuery = this.servicioService.serviceDetail(this.cardData._id || '');
    this.serviceDetailSubscription = this.serviceDetailQuery.valueChanges.pipe(
      map((res: any) => {
        return res.data.detalleServicio;
      })
    ).subscribe(
      (res: any) => {
        this.cardData.descripcion = res.descripcion;
        this.cardData.fechaHoraPublicacion = new Date(res.fechaHoraPublicacion!);
        this.cardData.usuario!.nombreApellido = res.usuario.nombreApellido;
        this.cardData.usuario!.email = res.usuario.email;
        this.cardData.usuario!.nivel = { nro: res.usuario.nivel.nro };
      },
      (err: any) => console.log(err)
    );
  }

  refreshServiceDetail(): void {
    this.serviceDetailQuery.refetch();
  }

  unsuscribeServiceDetail(): void {
    this.serviceDetailSubscription.unsubscribe();
  }

  mostrarDetalle(e: any) {
    e.preventDefault();
    e.stopPropagation();

    if (this.serviceDetailSubscription) {
      this.refreshServiceDetail();
    } else {
      this.suscribeServiceDetail();
    }

    const id = "#" + this.cardData._id;
    $(id).modal("show");
  }

  selectCat(e: any) {
    e.preventDefault();
    e.stopPropagation();

    this.seleccionarCategoria.emit();
  }

  realizarContrato(e: any) {
    e.preventDefault();
    e.stopPropagation();

    this.contratoService.signContract(this.cardData._id!).subscribe(
      () => {
        this.router.navigate(['serviciosContratados'])
      },
      (err: any) => {
        console.log(err.message);
      }
    );
  }

  irAlServicio(e: any) {
    this.router.navigate(['servicio/' + this.cardData._id]);
  }

}
