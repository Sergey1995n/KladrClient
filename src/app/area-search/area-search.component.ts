import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {KladrService} from "../kladr.service";
import {KladrModel} from "../model/kladr.model";
import {FormControl} from "@angular/forms";
import {debounceTime, delay, filter, ReplaySubject, Subject, takeUntil, tap} from "rxjs";
import {map} from "rxjs/operators";
import {KladrTypeEnum} from "../model/kladr-type.enum";


@Component({
  selector: 'app-area-search',
  templateUrl: './area-search.component.html',
  styleUrls: ['./area-search.component.scss']
})
export class AreaSearchComponent implements OnInit, OnDestroy, OnChanges {

  @Input()  value: KladrModel | undefined |  null;
  @Output() valueChange = new EventEmitter<KladrModel | undefined | null>();

  @Input() type: KladrTypeEnum | undefined | null;
  @Input() parent: KladrModel | undefined | null;

  @Input() name: string = '';

  public constructor(private kladrService: KladrService) {
  }


  /** control for the selected bank for server side filtering */
  public areaServerSideCtrl: FormControl<KladrModel | null> = new FormControl<KladrModel | null>(null);

  /** control for filter for server side. */
  public areaServerSideFilteringCtrl: FormControl<string | null> = new FormControl<string | null>('');

  /** indicate search operation is in progress */
  public searching = false;

  /** list of banks filtered after simulating server side search */
  public  filteredServerSideAreas: ReplaySubject<KladrModel[]> = new ReplaySubject<KladrModel[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  ngOnInit() {


    // listen for search field value changes
    this.areaServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (! search || search.trim().length  == 0) {
            return  this.kladrService.findItems(this.type, null, this.parent)
          }
          return this.kladrService.findItems(this.type, search, this.parent);
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(filteredArea => {
          filteredArea.subscribe(value => {
            this.searching = false;
            this.filteredServerSideAreas.next(value);
          })
        },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });

    this.kladrService.findItems(this.type, null, this.parent).subscribe(value => {
      this.searching = false;
      this.filteredServerSideAreas.next(value);
    });

    this.areaServerSideCtrl.valueChanges.subscribe(value => {
      this.value = value;
      this.valueChange.emit(value);
    });

  }

  public refreshData(parent: KladrModel | undefined | null): void {
    this.kladrService.findItems(this.type, null, parent).subscribe(value => {
      this.searching = false;
      this.filteredServerSideAreas.next(value);
    });

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }





}
