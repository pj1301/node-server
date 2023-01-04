import { Document, Model, ObjectId } from 'mongoose';

export interface iUser {
	email: string;
	username: string;
	role: string;
	active: boolean;
	firstName?: string;
	lastName?: string;
	_id?: ObjectId | string;
}

// can declare schema methods here
export interface iUserDocument extends Document {
	email: string;
	username: string;
	role: string;
	active: boolean;
	firstName?: string;
	lastName?: string;
	_id?: ObjectId | string;
}

// can declare statics here
export interface iUserModel extends Model<iUserDocument> {
	login(email: string, password: string): Promise<string | null>;
	authenticate(token: string): Promise<iUser | null>;
}
