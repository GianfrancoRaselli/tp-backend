import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const MIS_NOTIFICACIONES = gql`
  query misNotificaciones {
    misNotificaciones {
      _id
      descripcion
      link
      fechaHora
      leida
      abierta
      icono
    }
  }
`;

const LEER_NOTIFICACIONES = gql`
  mutation {
    readNotifications {
      _id
    }
  }
`;

const OPEN_NOTIFICATION = gql`
  mutation openNotification($idNotificacion: ID!) {
    openNotification(idNotificacion: $idNotificacion) {
      _id
      abierta
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private apollo: Apollo) { }

  misNotificaciones(): any {
    return this.apollo.watchQuery({
      query: MIS_NOTIFICACIONES,
      fetchPolicy: 'no-cache',
      pollInterval: 10000
    })
  }

  leerNotificaciones(): any {
    return this.apollo.mutate({
      mutation: LEER_NOTIFICACIONES
    });
  }

  abrirNotificacion(idNotificacion: string): any {
    return this.apollo.mutate({
      mutation: OPEN_NOTIFICATION,
      variables: {
        idNotificacion
      }
    })
  }

}
