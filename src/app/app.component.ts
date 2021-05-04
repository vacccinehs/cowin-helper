import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GetSlotService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  vaccineForm = new FormGroup({});
  response: any;
  submitted: boolean = false;
  timer: any;
  minDate:string = new Date().toISOString();
  constructor(private getSlotService: GetSlotService) {
    this.minDate = new DatePipe('en-US').transform(this.minDate, 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.vaccineForm = new FormGroup({
      date: new FormControl(''),
      pin: new FormControl(''),
    });
  }
  

  onSubmit() {
       this.timer = setInterval(() => {
        this.vaccineRequest();      
      }, 60000);
  }

  ngOnDestroy() {
    if(this.timer) {
      clearInterval(this.timer);
    }
  }

  vaccineRequest(): void {
    let params = {
      date: new DatePipe('en-US').transform(this.vaccineForm.controls.date.value, 'dd/MM/yyyy'),
      pin: this.vaccineForm.controls.pin.value
    }
    this.getSlotService.getDetails(params).subscribe((res) => {
      this.response = res.sessions;
      if(!this.submitted) {
        this.onSubmit();
      }
      this.submitted = true;
    });
  }
}
