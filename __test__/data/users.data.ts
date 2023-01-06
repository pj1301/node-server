const { ObjectId } = require('mongoose').Types;

export const users = [
	{
		_id: ObjectId('6396fc8e5a95b20000b9a659'),
		active: true,
		firstName: 'Admin',
		lastName: 'Admin',
		email: 'admin@test.com',
		role: 'admin',
		username: 'admin'
	},
	{
		_id: ObjectId('6396fcaf5a95b20000b9a65a'),
		active: false,
		firstName: 'Dev',
		lastName: 'Developer',
		email: 'dev@test.com',
		role: 'developer',
		username: 'dev'
	},
	{
		_id: ObjectId('63936292be586fb65205e37f'),
		active: true,
		firstName: 'Arnold',
		lastName: 'Terminator',
		email: 'willbeback@future.io',
		role: 'standard',
		username: 'killterminators'
	}
];
