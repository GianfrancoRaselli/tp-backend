import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Moneda } from 'src/app/models/Moneda';
import { ServicesService } from 'src/app/services/services.service';
import { Categoria } from '../../../models/Categoria';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-publicar-servicio',
  templateUrl: './publicar-servicio.component.html',
  styleUrls: ['./publicar-servicio.component.scss'],
})
export class PublicarServicioComponent implements OnInit {

  @Output() refreshServicios = new EventEmitter();
  
  @Input() categorias: Categoria[] = [];
  @Input() monedas: Moneda[] = [];

  errorMessage = '';

  serviceForm = new FormGroup({
    titulo: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    categoria: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
    ]),
    valor: new FormControl('', [
      Validators.required,
      Validators.min(0)
    ]),
    moneda: new FormControl('', [Validators.required]),
  });

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.servicesService.publish(this.serviceForm.value).subscribe(
      (res: any) => {
        this.errorMessage = '';
        $('#publicarServicioPopup').modal('hide');
        Swal.fire({
          title: '¡Servicio publicado!',
          text:
            'El servicio ' +
            this.serviceForm.value.titulo +
            ' se registró correctamente',
        });
        this.refreshServicios.emit();
      },
      (err: any) => {
        this.errorMessage = err.message;
      }
    );
  }
}
