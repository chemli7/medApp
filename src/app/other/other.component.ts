import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss'],
})
export class OtherComponent implements OnInit {
  score: number;
  year: number;
  school: number;
  course: number;
 constructor(private route: ActivatedRoute) { 
   this.route.params.subscribe( params => this.score = params["score"] );
   this.route.params.subscribe( params => this.year = params["year"] );
   this.route.params.subscribe( params => this.school = params["school"] );
   this.route.params.subscribe( params => this.course = params["course"] );


 }

 quiz() {
   window.location.href = "/quiz/2018/Monastir/Cardio"
   
 }

 ngOnInit() {}

}
