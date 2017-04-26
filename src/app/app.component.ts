import { Component, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  ui={
    title: "",
    orderby: 'Net Production',
  }
  sortkeys: string[];
  table:{}[] = [];

  private list=[];

  constructor(private http:Http) { }

  ngAfterViewInit() {
    this.http.get("https://s3-us-west-2.amazonaws.com/optimism-wslcb/WSLCB+2016.csv").subscribe(
      (data) => {
        let csv=data.text().replace(/[^a-zA-Z0-9 \.,]/,'');
        let lines=csv.split(/\r\n/);

        let table: {}[]=[];
        let columns:string[]=[];

        for (let i=0; i < lines.length; ++i) {
          if (lines[i].length) {
            let values=lines[i].split(/,/);
            switch (i) {
              case 0:
                this.ui.title=values[0];
                break;
              case 1:
                break;
              case 2:
                for (let value of values) {
                  columns.push(value);
                }
                break;
              default:
                let obj={};
                for (let v=0; v < values.length; ++v) {
                  obj[columns[v]]=values[v];
                }
                table.push(obj);
                break;
            }
          }
        }

        let totalcolumns=[
          "Net Production",
          "Distributor Sales Over",
          "Distributor Sales Under",
          "Brewery Retail Sales Over",
          "Brewery Retail Sales Under",
          "Retail Sales Over",
          "Retail Sales Under",
          "Military/ICC/Export",
        ];
        this.sortkeys=totalcolumns;

        let breweries:{}={};

        for (let row of table) {
          if (!breweries[row['License #']]) {
            breweries[row['License #']]={};
          }
          breweries[row['License #']]['License #']=row['License #'];
          breweries[row['License #']]['Tradename']=row['Tradename'];
          breweries[row['License #']]['Location City']=row['Location City'];
          for (let c of totalcolumns) {
            if (!breweries[row['License #']][c]) {
              breweries[row['License #']][c]=0;
            }
            breweries[row['License #']][c]+=+row[c];
          }
        }

        this.sortkeys.unshift('Location City');
        this.sortkeys.unshift('Tradename');

        this.list=[];
        for (let id of Object.keys(breweries)) {
          this.list.push(breweries[id]);
        }

        this.sortList(this.ui.orderby);

      }
    );
  }

  sortList(key) {
    let stringSort = (key) => {
      return (a,b) => {
        if (typeof(a[key]) !== 'string') { return -1; }
        else if (typeof(b[key]) !== 'string') { return 1; }
        else {
          return a[key].localeCompare(b[key]);
        }
      }
    }
    let numberSort = (key) => {
      return (a,b) => {
        console.log(a[key]);
        console.log(b[key]);
        return b[key] - a[key];
      }
    }

    let multiSort= (keys:string[]) => {
      return (a,b) => {
        let sortFunc:(a:any,b:any) => number;
        for (let key of keys) {
          switch (typeof(this.list[0][key])) {
            case 'string': sortFunc=stringSort(key); break;
            default: sortFunc=numberSort(key); break;
          }
          let answer=sortFunc(a,b);
          console.log(key+' ('+typeof(this.list[0][key])+'):'+answer);
          if (answer != 0) {
            return answer;
          }
        }
        return 0;
      }
    }

    // Sort the list
    this.table=this.list.sort( multiSort([key,'Net Production']) );

  }
}
