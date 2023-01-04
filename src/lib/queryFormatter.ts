import { Types } from 'mongoose';

const { ObjectId } = Types;

export function formatQuery(query: Record<string, any>): Record<string, any> {
	const final: Record<string, any> = {};

	for (const [k, v] of Object.entries(query)) {
		if (ObjectId.isValid(v)) {
			final[k] = new ObjectId(v);
		} else if (
			typeof v === 'string' &&
			(v.includes('start') || v.includes('end'))
		) {
			final[k] = {};
			const { start, end } = JSON.parse(v);
			if (start) final[k]['$gte'] = new Date(start);
			if (end) final[k]['$lte'] = new Date(end);
		} else if (
			Array.isArray(v) &&
			(v[0].includes('start') || v[0].includes('end'))
		) {
			final[k] = {};
			v.forEach((query: string) => {
				let { start, end } = JSON.parse(query);
				if (start) {
					start = new Date(start);
					start.setHours(0, 0, 0);
					final[k]['$gte'] = start;
				}
				if (end) {
					end = new Date(end);
					end.setHours(23, 59, 59);
					final[k]['$lte'] = end;
				}
			});
		} else {
			final[k] = v;
		}
	}
	return final;
}
