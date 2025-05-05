import { EnergyxItem } from '../models';
import { RestService } from './restService';

export class ItemService extends RestService<EnergyxItem> {
    public constructor(baseUrl: string, baseRoute: string) {
        super(baseUrl, baseRoute);
    }
}
