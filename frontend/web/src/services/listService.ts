import { EnergyxList } from '../models';
import { RestService } from './restService';

export class ListService extends RestService<EnergyxList> {
    public constructor(baseUrl: string, baseRoute: string) {
        super(baseUrl, baseRoute);
    }
}
