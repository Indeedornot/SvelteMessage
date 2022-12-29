import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export const formatCreateDate = (date: Date | undefined) => {
	return dayjs(date).format('ll');
};
