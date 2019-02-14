/**
 * @description
 * Servicio para la obtención del usuario conectado via API.
 */

// angular
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable ,  Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

// app services
import { Apisettings, getBaseUrl } from '../appConfig';

// app clases
//import { User } from '../classes/user';

@Injectable()
export class BillingService {

  public headers: HttpHeaders;
  private _baseUrl = getBaseUrl();

  constructor(
    private _http: HttpClient,
    private _as: Apisettings) {
  }

  createHeaders(): void {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      //'Authorization': null
    });
  }

  getClient(nif?: String): Observable<any> {
    this.createHeaders();
    let url = "http://" + this._baseUrl + this._as.apiPort + '/api/cliente';
    if (nif) {
      url = url + '/' + nif;
    }
    console.log(url, this.headers)
    var result = this._http.get(url, {headers: this.headers})
    console.log(result)
    return this._http.get("localhost:5001/api/client/01234567L", {headers: this.headers});
  }

  getBillings(): Observable<any> {
    this.createHeaders();
    let url = this._baseUrl + this._as.apiPort + '/api/billings';
    return this._http.get(url, {headers: this.headers});
  }


  postBilling(id_billing: String, id_client: String, CUPS: String, kws: Number, amount: Number,
              paid: Boolean, issued_at: Date): Observable<any> {
    this.createHeaders();
    let data= 'json={"id_billing": "' + id_billing + '", "id_client": "' + id_client + '", "CUPS": "' + CUPS +
      '", "kws": ' + kws + ', "amount": ' + amount + ', "paid": ' + paid + ', "issued_at": "' + issued_at + '"}'
    let url = this._as.baseUrl + this._as.apiPort + '/api/billing/';
    return this._http.post(url, data, {headers: this.headers}).pipe(
      map(response => response))
  }

  putBilling(id_billing: String, id_client: String, CUPS: String, kws: Number, amount: Number,
              paid: Boolean, issued_at: Date, paid_at: String): Observable<any> {
    this.createHeaders();
    let data= 'json={"id_billing": "' + id_billing + '", "id_client": "' + id_client + '", "CUPS": "' + CUPS +
      '", "kws": ' + kws + ', "amount": ' + amount + ', "paid": ' + paid + ', "issued_at": "' + issued_at +
      ', "issued_at": "' + paid_at + '"}'
    let url = this._as.baseUrl + this._as.apiPort + '/api/billing/';
    return this._http.put(url, data, {headers: this.headers}).pipe(
      map(response => response))
  }

}
