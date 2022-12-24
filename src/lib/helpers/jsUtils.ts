export const updateRef = <T extends K, K>(ref: T, updateData: K) => {
	for (const key in updateData) {
		//@ts-expect-error - this is a hack to get around the fact that we can't use keyof on a generic type
		ref[key] = updateData[key];
	}
};

export const updateRefByKeys = <T extends K, K>(ref: T, updateData: K, keys: (keyof K)[]) => {
	for (const key of keys) {
		//@ts-expect-error - this is a hack to get around the fact that we can't use keyof on a generic type
		ref[key] = updateData[key];
	}
};

export const getDifferentInObject = <T extends K, K>(obj1: T, obj2: K): K => {
	const diff = {} as K;
	for (const key in obj2) {
		if (obj1[key] !== obj2[key]) {
			diff[key] = obj2[key];
		}
	}
	return diff;
};

export const getDifferentInObjectByKeys = <T extends K, K>(obj1: T, obj2: K, keys: (keyof K)[]): K => {
	const diff = {} as K;
	for (const key of keys) {
		if (obj1[key] !== obj2[key]) {
			diff[key] = obj2[key];
		}
	}
	return diff;
};

export const isEmptyObject = (obj: any) => {
	return Object.keys(obj).length === 0;
};

export const browserUtils = {
	log: (...args: any[]) => {
		console.log('[browser]', ...args);
	},
	error: (...args: any[]) => {
		console.error('[browser]', ...args);
	}
};
