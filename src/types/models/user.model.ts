import { JwtPayload } from 'jsonwebtoken';
import { model, Schema } from 'mongoose';

import { validateToken, compare } from '../../lib';
import { iUser, iUserModel } from '..';

const userSchema = new Schema<iUser>(
	{
		firstName: {
			type: String,
			required: false
		},
		lastName: {
			type: String,
			required: false
		},
		username: {
			type: String,
			required: true,
			unique: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: function (value: string) {
					return /[a-z0-9]{0,}(@[a-z0-9]{0,}\.[a-z]{0,})$/.test(value);
				}
			}
		},
		role: {
			type: String,
			default: 'standard',
			enum: ['standard', 'manager', 'admin', 'developer']
		},
		password: {
			type: String
		},
		active: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt'
		}
	}
);

userSchema.statics.login = async function (
	username: string,
	password: string
): Promise<iUser | null> {
	const user = await this.findOne({
		$or: [{ email: username }, { username }]
	});
	if (!user) return null;

	if (!compare(password, user.password as string)) return null;

	return user;
};

userSchema.statics.authenticate = async function (
	token: string
): Promise<iUser | null | void> {
	const { id } = (await validateToken(token)) as JwtPayload;
	if (!id) return;
	const user = await this.findById(id).select('-password');
	if (!user) return;
	return user;
};

const User = model<iUser, iUserModel>('User', userSchema);

export { User };
