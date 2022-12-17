export const generateRandomAvatar = () => {
	return `https://icotar.com/avatar/${Math.random().toString(36).substring(7)}`;
};
