/**
 * @description
 * Clase para la definición de los puertos e IP's de la API
 */

export class Apisettings {
  public baseUrl: string;
  public defaultPort: number;
  public apiPort: number;
}

export let APISETTINGS: Apisettings = {
  baseUrl: '',
  defaultPort: 80,
  apiPort: 5001
};

// funcion para generar la url base de la API
export function getBaseUrl(): string {
  let hostname: string = window.location.hostname.toString();
  let baseUrl: string;
  switch (hostname) {
    case 'localhost': // localhost
      baseUrl = 'localhost:';
      break;
    /*case '172.18.74.128': // BMW
      baseUrl = 'http://172.18.74.128:';
      break;*/
  }
  return baseUrl;
}
