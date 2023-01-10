import { Document, model, Schema, ObjectId } from 'mongoose';

import { generateToken, validateToken } from 'lib';
import { eTokenType } from '../enums/tokenType.enum';
import { iToken, iTokenDocument, iTokenModel } from '../interfaces/i-token';

const tokenSchema = new Schema(
	{
		identifier: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: 'docModel'
		},
		token: { type: String, required: true },
		type: { type: eTokenType, required: true },
		docModel: { type: String, required: true, enum: ['User'] }
	},
	{
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt'
		}
	}
);

tokenSchema.pre('save', function (next) {
	let expiry: string | undefined;
	switch (this.type) {
		case eTokenType.AUTH as string:
			expiry = '3d';
			break;
		case eTokenType.SINGLE_AUTH as string:
			expiry = '5m';
			break;
	}

	this.token = generateToken(this.identifier.toString(), { expiry });
});

tokenSchema.statics.verify = async function (
	token: string,
	permittedTypes: Array<eTokenType>
): Promise<Document | null | void> {
	/* First validate JWT token */
	if (!(await validateToken(token))) return;

	/*
	Then check token exists in db
	if not, return null
	*/
	const storedToken = (await Token.findOne({
		token
	}).populate('identifier')) as iToken;
	if (!storedToken) return;

	/*
	Next check the permitted types against
	the stored token type
	if permittedTypes does not contain the
	stored token type, return null
	*/
	if (!permittedTypes.includes(storedToken.type)) return;

	const accessor = storedToken.identifier as unknown as Document<
		ObjectId,
		null,
		any
	>;

	// return the found record
	return accessor;
};

const Token = model<iTokenDocument, iTokenModel>('Token', tokenSchema);

export { Token };
