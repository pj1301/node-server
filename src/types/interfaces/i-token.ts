import { Document, Model, ObjectId } from 'mongoose';

import { eTokenType } from '../enums/tokenType.enum';
import { iDatabaseObject } from './i-db-record';

export interface iToken extends iDatabaseObject {
	identifier: ObjectId; // could be a user or potentially another object which requires authentication
	token: string;
	type: eTokenType; // single use | regular auth
	docModel: string;
	expireAt: Date;
}

export interface iTokenModel extends Model<iToken> {
	verify(token: string, type: eTokenType): Promise<iToken | null>;
}
