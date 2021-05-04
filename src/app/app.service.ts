import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GetSlotService {
  constructor(private http: HttpClient) {
  }

    getDetails(params?: any): Observable<any> {
        return this.http.get("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" + params.pin + "&date=" + params.date +"");
    }
}    