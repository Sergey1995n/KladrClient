import {Component, OnInit, ViewChild} from '@angular/core';
import {KladrTypeEnum} from "./model/kladr-type.enum";
import {KladrModel} from "./model/kladr.model";
import {AreaSearchComponent} from "./area-search/area-search.component";
import {KladrService} from "./kladr.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  @ViewChild('area') areaSearchComponent!: AreaSearchComponent;
  @ViewChild('region') regionSearchComponent!: AreaSearchComponent;
  @ViewChild('city') citySearchComponent!: AreaSearchComponent;

  types = KladrTypeEnum;

  valueArea: KladrModel | undefined |  null = null;

  valueRegion: KladrModel | undefined |  null = null;

  valueCity: KladrModel | undefined |  null = null;

  public constructor(private kladrService: KladrService) {
  }

  ngOnInit() {
  }

  public changeArea(kladrModel: KladrModel | undefined | null): void {
    this.regionSearchComponent.refreshData(kladrModel);
  }

  public changeRegion(kladrModel: KladrModel | undefined | null): void {
    if (kladrModel?.parentId !== this.valueArea?.id) {
      this.kladrService.getItem(kladrModel?.parentId).subscribe(value => {
        this.valueArea = value;
        this.areaSearchComponent.areaServerSideCtrl.setValue(value);
      });
    }
  }

  public changeCity(kladrModel: KladrModel | undefined | null): void {

  }

}
