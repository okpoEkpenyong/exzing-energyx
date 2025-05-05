import { RestService } from './restService';
import { energyxItem } from '../models';

export class ItemService extends RestService<energyxItem> {
    public constructor(baseUrl: string, baseRoute: string) {
        super(baseUrl, baseRoute);
    }
}
