import type { UserData, UserUpdateData } from '$lib/models';

export const updateUserRef = (data: UserData, updateData: UserUpdateData) => {
	for (const key in updateData) {
		data[key] = updateData[key];
	}
};
