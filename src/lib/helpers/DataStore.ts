export const getUserData = (): number | null => {
	const user = localStorage.getItem('userId');
	return user ? JSON.parse(user) : null;
};

export const setUserData = (user: number) => {
	localStorage.setItem('userId', JSON.stringify(user));
};
