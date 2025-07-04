/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PageResponseDtoDepartamentoHospital } from '../../models/page-response-dto-departamento-hospital';

export interface GetAllPaginatedDepartamentoHospital$Params {

/**
 * Índice de la página a recuperar.
 */
  pageIndex?: number;

/**
 * Tamaño de la página.
 */
  pageSize?: number;
}

export function getAllPaginatedDepartamentoHospital(http: HttpClient, rootUrl: string, params?: GetAllPaginatedDepartamentoHospital$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseDtoDepartamentoHospital>> {
  const rb = new RequestBuilder(rootUrl, getAllPaginatedDepartamentoHospital.PATH, 'get');
  if (params) {
    rb.query('pageIndex', params.pageIndex, {});
    rb.query('pageSize', params.pageSize, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageResponseDtoDepartamentoHospital>;
    })
  );
}

getAllPaginatedDepartamentoHospital.PATH = '/departamentohospitales';
