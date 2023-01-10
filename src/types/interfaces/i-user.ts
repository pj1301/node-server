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

// can declare statics here
export interface iUserModel extends Model<iUser> {
	login(email: string, password: string): Promise<iUser | null>;
	authenticate(token: string): Promise<iUser | null>;
}
