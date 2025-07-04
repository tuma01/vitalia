/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Municipio } from '../../models/municipio';

export interface GetMunicipioById$Params {

/**
 * ID del municipio a recuperar.
 */
  id: number;
}

export function getMunicipioById(http: HttpClient, rootUrl: string, params: GetMunicipioById$Params, context?: HttpContext): Observable<StrictHttpResponse<Municipio>> {
  const rb = new RequestBuilder(rootUrl, getMunicipioById.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Municipio>;
    })
  );
}

getMunicipioById.PATH = '/municipios/{id}';
