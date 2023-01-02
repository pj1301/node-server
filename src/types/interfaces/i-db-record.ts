import { ObjectId } from 'mongodb';

export interface iDatabaseObject {
	_id?: ObjectId | string;
}
