export function duplicateWithoutId(data: any): any {
	if (['string', 'number', 'boolean'].includes(typeof data)) return data;

	if (Array.isArray(data)) {
		return data.map((d) => duplicateWithoutId(d));
	}

	const newObject = { ...data };
	if (data._id) delete newObject._id;

	return newObject;
}
