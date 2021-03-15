import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  pointer: number;
  score: number;
  colors: string[];
  selected: string[];
  disabled: boolean;
  answered: boolean[];
  selectionColor:string="#0e6fce";
  propositionColor:string="newgray";
  QsizeList = []
  successPercentage: number = 0;
  data: any;

  constructor(private route: ActivatedRoute,private http: HttpClient) { }

  // waiting for db
  QList = [""];
  QAnswers = [["A-","B-","C-","D-","E-"]];
  QDecision = [];
  QSelected = [];

  Username: String = "USER";
  time = 10;


Back() {
  if (this.pointer !=0) {
  this.pointer = this.pointer - 1
  // if answered[pointer] block and show right answers and selected ones
  // else initate colors and selected
  if (this.answered[this.pointer]) { this.showRightAnswers(); this.showSelectedAnswers()}
  else { this.newQuestion() } }
}
Next() {
  if (this.pointer + 1!=this.QAnswers.length) {
  this.pointer = this.pointer + 1
  if (this.answered[this.pointer]) { this.showRightAnswers(); this.showSelectedAnswers()}
  else { this.newQuestion() } }
  else{
    window.location.href = "/other/"+this.score+"/"+this.data["year"]+"/"+this.data["school"]+"/"+this.data["course"];
    this.updateStatsData();
  } 
}

block(){
  this.disabled = true;
}
release(){
  this.disabled = false;
}

showRightAnswers(){
  // delete past colors
  for (let s of [0,1,2,3,4]) this.colors[s] = ""
  // fill right colors
  for ( let s of this.QDecision[this.pointer] ) { this.colors[s] = "success"; }
}

showSelectedAnswers() {
this.selected = this.QSelected[this.pointer]
}


newQuestion() {
  this.colors = [this.propositionColor,this.propositionColor,this.propositionColor,this.propositionColor,this.propositionColor];
    this.selected= ["","","","",""]
        this.release()
}

QSizing() {
  this.QsizeList = []
for ( let s of this.QList) {
  
  let l = s.length;
  console.log(l);
  
  if (l >= 100 && l <= 175) this.QsizeList.push("150%")
  else if (l >= 175 && l <= 250) this.QsizeList.push("125%")
  else if (l >= 250) this.QsizeList.push("100%")
  else if (l <= 100) this.QsizeList.push("180%")
}

console.log(this.QsizeList)
}


calculScore(){
      var s =0;
        //we assume that the length of QDecisions == QColors
        if (this.intruderExists(this.QDecision[this.pointer],this.selected)){
          return 0
        }else{
          //No intruder => score >= 0
          for ( let i=0;i<this.QDecision[this.pointer].length;i++){
            if( this.selected[this.QDecision[this.pointer][i]] == this.selectionColor){
              s =s+ 1/this.QDecision[this.pointer].length;
            }
          }
        }
    
    return s;
  }

  intruderExists(decision:number[],colors:string[]): boolean{
    console.log(decision,colors)


    for (let i=0;i<colors.length;i++){
      if(colors[i]!="" && !decision.includes(i)){
        return true;
      }
    }
    return false;
  }


  go() {
    if (!this.answered[this.pointer]){
      this.showRightAnswers()
      //this.block()
      // answered
      this.answered[this.pointer] = true;
      //scoring
      this.score = this.score + this.calculScore();
      console.log(this.score);
      
      // saving answers
      this.QSelected[this.pointer] = this.selected
      // Score indicator
      this.successPercentage = this.successPercentage + (1/this.QList.length)*100;
    }
  }

  selectAnswer(q:number) {
    if (!this.answered[this.pointer]){
      if (this.selected[q] == "") this.selected[q] = this.selectionColor;
      else if (this.selected[q] == this.selectionColor) this.selected[q] = ""
    }
    
  }

  getData(){

    let url  ="http://localhost:8080/data";
    let data ={"name": "", "year":"","course":"","school":""}
    this.route.params.subscribe( params => data['year'] = params["year"]);
    this.route.params.subscribe( params => data['course'] = params["course"]);
    this.route.params.subscribe( params => data['school'] = params["school"]);
    this.data = data

    this.http.post<any[]>("http://localhost:8080/data", {"name": "", "year":data["year"],"course":data["course"],"school":data["school"]}).subscribe(data => {

        data = data["data"];

        
        this.QAnswers=[];
        this.QList=[];
        for (let i=0;i<data.length;i++){
          this.QList.push(data[i]['title']);
          this.QAnswers.push([]);
          this.QAnswers[i].push(data[i]['A']);
          this.QAnswers[i].push(data[i]['B']);
          this.QAnswers[i].push(data[i]['C']);
          this.QAnswers[i].push(data[i]['D']);
          this.QAnswers[i].push(data[i]['E']);
          this.QDecision.push(data[i]['rightAnswers']);  
        }        
        this.QSizing()
    });

  }

  initVariables(){
    for (let i of this.QList){
      this.answered.push(false);
    }
    
  }

  ngOnInit() {
    this.pointer = 0;
    this.score = 0;
    this.colors = [this.propositionColor,this.propositionColor,this.propositionColor,this.propositionColor,this.propositionColor];
    this.selected= ["","","","",""];
    this.answered = [];
    this.disabled=false;
    this.getData();    
    this.initVariables();
    
    
  }

  /* 
    if a user finishes a quiz:
    - quiz (serie) list will be extended by one ==  /{username}/quiz/quiz_list (((+ NewQuiz{year,school,course})))
    - length(serie) + 1 ... == /{username}/quiz/number_quiz CORRECTE_done + 1 
    - length(serie) + 1 ... == /{username}/quiz/number_quiz_done + 1 
    - avg score changes ==  /{username}/quiz/avg_score
    - nombre de QCM totale done + nmbre qcm fait == /{username}/quiz/nmbre_qcm_done
    - nmbre_qcm_faculte[facult]+nmbre de qcm faits == /{username}/faculte/nmbre_qcm
    - nmbre_qcm_annee[annee]+nmbre de qcm faits  == /{username}/annee /nmbre_qcm
  */

  updateStatsData(){
    // QUIZ
    var path:String = this.Username + "/quiz/quiz_list";
    this.http.post<any[]>("http://localhost:8080/get_specific_statistics",{"path":path}).subscribe(data => {
      var list: any[] = data["list"];
      list.push(this.data["year"]+"|"+this.data["school"]+"|"+this.data["course"]);
      this.http.post<any[]>("http://localhost:8080/post_specific_statistics",{"path":path, "data":list}).subscribe(data => {
        
      
      // Average score ----------------------------------
        path = this.Username + "/quiz/avg_score";
        this.http.post<any[]>("http://localhost:8080/get_specific_statistics",{"path":path}).subscribe(data => {
        var avg_score = data["avg_score"];
        avg_score = (avg_score*(list.length-1) + (this.score/this.QList.length))/list.length; 
        this.http.post<any[]>("http://localhost:8080/post_specific_statistics",{"path":path, "data":avg_score}).subscribe(data => {
        
          })
        })
      })
      // ------------------------------------
    })

    // number_quiz_done
    path = this.Username + "/quiz/number_quiz_done";
    this.http.post<any[]>("http://localhost:8080/get_specific_statistics",{"path":path}).subscribe(data => {
      var number_quiz = data["number_quiz"];
      number_quiz ++ ;
      this.http.post<any[]>("http://localhost:8080/post_specific_statistics",{"path":path, "data":number_quiz}).subscribe(data => {
        
      })
    })

    // number_correct_qcm 
    path = this.Username + "/quiz/number_correct_qcm";
    this.http.post<any[]>("http://localhost:8080/get_specific_statistics",{"path":path}).subscribe(data => {
      var number_correct_qcm = data["number_correct_qcm"];
      number_correct_qcm = number_correct_qcm + this.score; 
      this.http.post<any[]>("http://localhost:8080/post_specific_statistics",{"path":path, "data":number_correct_qcm}).subscribe(data => {
        
      })
    })

    
    // nombre de QCM totale done
    path = this.Username + "/quiz/number_qcm_done";
    this.http.post<any[]>("http://localhost:8080/get_specific_statistics",{"path":path}).subscribe(data => {
      var number_qcm_done = data["number_correct_quiz"];
      number_qcm_done = number_qcm_done + this.QList.length; 
      this.http.post<any[]>("http://localhost:8080/post_specific_statistics",{"path":path, "data":number_qcm_done}).subscribe(data => {
        
      })
    })

    
    // nombre de QCM totale done by faculte 
    //nmbre_qcm_faculte[facult]+nmbre de qcm faits == /{username}/faculte/nmbre_qcm
    path = this.Username + "/quiz/number_qcm_done_faculte";
    this.http.post<any[]>("http://localhost:8080/get_specific_statistics",{"path":path}).subscribe(data => {
      var number_qcm_done_faculte = data[this.data["school"]];
      number_qcm_done_faculte = number_qcm_done_faculte + this.QList.length; 
      this.http.post<any[]>("http://localhost:8080/post_specific_statistics",{"path":path, "data":number_qcm_done_faculte}).subscribe(data => {
        
      })
    })

    // nombre de QCM totale done by year 
    //nmbre_qcm_annee[annee]+nmbre de qcm faits  == /{username}/annee /nmbre_qcm
    path = this.Username + "/quiz/number_qcm_done_year";
    this.http.post<any[]>("http://localhost:8080/get_specific_statistics",{"path":path}).subscribe(data => {
      var number_qcm_done_year = data[this.data["year"]];
      number_qcm_done_year = number_qcm_done_year + this.QList.length; 
      this.http.post<any[]>("http://localhost:8080/post_specific_statistics",{"path":path, "data":number_qcm_done_year}).subscribe(data => {
        
      })
    })
    
  }

}
