import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  age: string;
  radioId: string = "btnradio1";
  isShowBadge:boolean = false;
  constructor(private getSlotService: GetSlotService) {
    this.minDate = new DatePipe('en-US').transform(this.minDate, 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.vaccineForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
      pin: new FormControl('',[Validators.required]),
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

  onChange(e): void {
    if(e && e.target && e.target.value) {
      this.radioId = e.target.id;
      this.age = e.target.value;

    }
  }

  vaccineRequest(): void {
    let params = {
      date: new DatePipe('en-US').transform(this.vaccineForm.controls.date.value, 'dd/MM/yyyy'),
      pin: this.vaccineForm.controls.pin.value
    }
    this.getSlotService.getDetails(params).subscribe((res) => {
      if(this.age === "18" || this.age === "45") {
        this.response = res.sessions.filter(slot => slot.min_age_limit <= this.age &&  slot.available_capacity > 0);
      } else{
        this.response = res.sessions;
      }
      if(this.response && this.response.length > 0){
        this.isShowBadge = false;
        Notification.requestPermission();

        setTimeout(()=>{
            var notification = new Notification('Sloats availble now!!', {
                icon: 'https://prod-cdn.preprod.co-vin.in/assets/images/covid19logo.jpg',
                body: 'Hey there! Sloats for vaccination are availbale now.',
               });
        },5000)

      } else{
        this.isShowBadge = true;
      }
      if(!this.submitted) {
        this.onSubmit();
      }
      this.submitted = true;
    });
  }
}
