import { RestService } from './restService';
import { energyxList } from '../models';

export class ListService extends RestService<energyxList> {
    public constructor(baseUrl: string, baseRoute: string) {
        super(baseUrl, baseRoute);
    }
}
