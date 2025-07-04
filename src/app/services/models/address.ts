/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { Country } from '../models/country';
import { Departamento } from '../models/departamento';

/**
 * Schema to hold Address information
 */
export interface Address {

  /**
   * Bloque al que pertenece el address
   */
  bloque?: string;

  /**
   * Casilla Postal de Address
   */
  casillaPostal?: string;

  /**
   * Ciudad de Address
   */
  ciudad?: string;
  country?: Country;
  departamento?: Departamento;

  /**
   * Direccion principal de address
   */
  direccion: string;

  /**
   * Id Address de Address
   */
  id?: number;

  /**
   * Geometry data with spatial index
   */
  location?: string;

  /**
   * medidor de la Direccion
   */
  medidor?: string;

  /**
   * Numero de la Direccion
   */
  numero?: string;

  /**
   * Numero de departamento de la Direccion
   */
  numeroDepartamento?: string;

  /**
   * Piso del address
   */
  piso?: number;
}
