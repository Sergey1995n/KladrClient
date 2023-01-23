import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {KladrTypeEnum} from "./model/kladr-type.enum";
import {KladrModel} from "./model/kladr.model";
import {Observable} from "rxjs";

@Injectable()
export class KladrService {

  public constructor(private httpClient: HttpClient) {
  }

  public findItems( type: KladrTypeEnum | undefined | null, query?: string | undefined | null, parent?: KladrModel | undefined | null): Observable<KladrModel[]> {
    let params: HttpParams = new HttpParams();
    if (type || type === 0) {
      params = params.append("type", type);
    }
    if (query) {
      params = params.append("query", query);
    }
    if (parent) {
      params = params.append("parentId", parent.id);
    }
    return this.httpClient.get<KladrModel[]>(`/api/kladr/kladr`, {params: params});
  }

  public getItem( id: string | undefined | null): Observable<KladrModel> {
    return this.httpClient.get<KladrModel>(`/api/kladr/item?id=${id}`);
  }

}
