import type { UserChangedData, UserData } from '$lib/models/User/UserData';

export const getUserData = (): UserData | null => {
	const user = localStorage.getItem('userData');
	return user ? JSON.parse(user) : null;
};

export const setUserData = (user: UserData) => {
	localStorage.setItem('userData', JSON.stringify(user));
};

export const updateUserData = (user: UserChangedData) => {
	const userData = getUserData();
	if (!userData) return;
	setUserData({ ...userData, ...user });
};
