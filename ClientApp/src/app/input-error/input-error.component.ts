import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.css']
})
export class InputErrorComponent implements OnInit, AfterViewInit {
  @Input() control: FormControl;

  constructor() { }

  //loadControl(): void {
  //  this.control.valueChanges.subscribe(data => {
  //    console.log('control changes', data);
  //    if (this.control.errors.maxlength) {
  //      console.log('max length', this.control.errors.maxlength.requiredLength);
  //    }
  //  });
  //}

  ngOnInit() {
    //this.loadControl();
  }

  ngAfterViewInit(): void {
    //this.loadControl();
  }
}
