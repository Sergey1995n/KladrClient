import {KladrTypeEnum} from "./kladr-type.enum";

export class KladrModel {
  public id: string = '';
  public parentId: string = '';
  public name: string = '';
  public displayName: string = '';
  public KladrType: KladrTypeEnum = KladrTypeEnum.AREA;

}
