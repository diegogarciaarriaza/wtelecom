import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { BillingService } from '../services/billing.service';


@Component({
  selector: 'billing',
  templateUrl: './billing.component.html',
  //styleUrls: ['./billing.component.css']
  providers: [
    BillingService
  ]
})
export class BillingComponent implements OnInit{

  public client = {"nif": "", "name": "", "surname": "", "id": ""}
  public billing = {"id": "", "CUPS": "", "kws": 0, "amount": 0, "issued_at": new Date(),
    "paid": true, "paid_at": null}
  public getBillingsSubscription: Subscription;
  public putBillingsSubscription: Subscription;
  public postBillingsSubscription: Subscription;
  public completePetitions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _billingService: BillingService,
  ) {

  }

  ngOnInit(): void {

  }

  updateClient() : void{
    this.client.nif = "01234567L";
    this.getClient()
  }

  updateBilling() : void{

  }

  getClient(): void {
    this.getBillingsSubscription = this._billingService.getClient(this.client.nif).subscribe(result => {
      if (result.code && result.code === 200 && result.data) {
        // ordenamos peticiones por fecha
        this.completePetitions = result.data.sort((a, b) => {
          return a.id > b.id ? 1 : -1;
        });
      } else {
      }
    }, error => {
      console.log("ERROR", error)
    });
  }

  getBillings(): void {
    this.getBillingsSubscription = this._billingService.getBillings().subscribe(result => {
      if (result.code && result.code === 200 && result.data) {
        // ordenamos peticiones por fecha
        this.completePetitions = result.data.sort((a, b) => {
          return a.id > b.id ? 1 : -1;
        });
      } else {
      }
    }, error => {
      console.log("ERROR", error)
    });
  }

  postBilling(): void {
    this.postBillingsSubscription = this._billingService.postBilling(this.billing.id, this.client.id,
      this.billing.CUPS, this.billing.kws, this.billing.amount, this.billing.paid, this.billing.issued_at)
      .subscribe(result => {
      if (result.code && result.code === 200 && result.data) {
        // ordenamos peticiones por fecha
        this.completePetitions = result.data.sort((a, b) => {
          return a.id > b.id ? 1 : -1;
        });
      } else {
      }
    }, error => {
      console.log("ERROR", error)
    });
  }

  putBilling(): void {
    this.putBillingsSubscription = this._billingService.putBilling(this.billing.id, this.client.id,
      this.billing.CUPS, this.billing.kws, this.billing.amount, this.billing.paid, this.billing.issued_at,
      this.billing.paid_at).subscribe(result => {
        if (result.code && result.code === 200 && result.data) {
          // ordenamos peticiones por fecha
          this.completePetitions = result.data.sort((a, b) => {
            return a.id > b.id ? 1 : -1;
          });
        } else {
        }
      }, error => {
        console.log("ERROR", error)
      });
  }
}
