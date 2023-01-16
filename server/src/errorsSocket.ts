/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const socketErrorHandler = (handler: any) => {
	const handleError = (err: any) => {
		if (err.message === 'No record of this user being active'){
			void err;
			console.log('never online');
		} else {
			console.error('please handle me', err);
		}
		// void err;
	};

	return (...args: any) => {
		// const [Socket] = args;
		// console.log(Socket);

		try {
			const ret = handler.apply(this, args);
			if (ret && typeof ret.catch === 'function') {
				// async handler
				ret.catch(handleError);
			}
		} catch (e) {
			// sync handler
			handleError(e);
		}
	};
};
