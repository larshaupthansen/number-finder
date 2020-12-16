import { AfterViewInit, Component } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {

  rows = 4;
  columns = 5;
  letters = ['A','B','C','D','E','F','G','H'];
  randomNumbers = [];
  pattern= [
    [0],
    [1,5],
    [2,6,10],
    [3,7,11,15],
    [4,8,12,16],
    [9,13,17],
    [14,18],
    [19]
  ];
  alreadyclicked= false;

  ngAfterViewInit() {
    this.generateRandomNumbers();
    this.generateBoard();
    this.addClickHandlers();
  } 

  generateRandomNumbers() {

    var slots = [];
    for(let r=0; r < this.rows; r++) {
      for(let c=0; c < this.columns; c++) {
        var index = (r)*this.columns + c;
        slots.push(index+1);
      }
    }

    this.randomNumbers=[];
    while(slots.length>0) {
      // pick a random slot
      var index = Math.floor(Math.random() * slots.length);

      // get the number
      var number = slots[index];
      // add it to the array
      this.randomNumbers.push(number);

      // and remove the slot so we dont choose the same slot twich
      slots.splice(index,1);

    }
  }

  generateBoard() {
    let html ="";
    for(let r=0; r < this.rows; r++) {
      for(let c=0; c < this.columns; c++) {
        var index = (r)*this.columns + c;
        html += "<div class='piece' id='piece"+index+"'><div class='piece-inner'>"
              + "<div class='piece-front'>"+this.letters[r]+(c+1)+"</div>"
              + "<div class='piece-back'>"+this.randomNumbers[index]+"</div>"
              +"</div></div>";
      }
  
    }
    $("#board").html(html);
  }

  addClickHandlers() {
    for(let r=0; r < this.rows; r++) {
      for(let c=0; c < this.columns; c++) {
        var index = (r)*this.columns + c;
        $("#piece"+index).on("click", (e)=>{
          this.clickHandler(e);
        });
      }
    }
  }

  clickHandler(e: JQuery.ClickEvent){

    if(this.alreadyclicked) {
      return;
    }
    var piece = e.target.closest(".piece");
    console.log(piece);
    $(piece).addClass("piece-selected");
    $(piece).addClass("piece-turned");

    var index = $(piece).attr("id").substring(5);
    this.alreadyclicked = true;
    var callback = () => {
        this.flipOthers(0,parseInt(index));
    };
    setTimeout(
      callback, 200
    );

  }

  flipOthers(index: number, selected: number) {

    console.log("flipothers i="+index+", s="+selected );
    console.log("Pattern:"+this.pattern);
    var currentLine = this.pattern[index];

    for(let i = 0; i < currentLine.length; i++) {
      if(currentLine[i] != selected){
        $("#piece"+currentLine[i]).addClass("piece-turned");
      }
    }

    if(index < this.pattern.length-1) {
      var callback = () => {
        this.flipOthers(index+1,selected);
    };
    setTimeout(
      callback, 200
    );
  
    }
  }
}
