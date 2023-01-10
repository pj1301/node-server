import { Document, Model, ObjectId } from 'mongoose';
import { iDatabaseObject } from './i-db-record';

export interface iUser extends iDatabaseObject {
	email: string;
	username: string;
	role: string;
	active: boolean;
	firstName?: string;
	lastName?: string;
	password?: string;
}

// can declare schema methods here
export interface iUserDocument extends Document<ObjectId, null, iUser> {}

// can declare statics here
export interface iUserModel extends Model<iUserDocument> {
	login(email: string, password: string): Promise<iUser | null>;
	authenticate(token: string): Promise<iUser | null>;
}
