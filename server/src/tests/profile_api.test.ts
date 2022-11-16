import { describe, expect } from '@jest/globals';
import supertest from 'supertest';

import { app } from '../app';
import { clearSessions } from '../repositories/sessionRepository';
// import { clearSessions, findSessionsByUserId } from '../repositories/sessionRepository';
import { clearUsers, findUserByUsername } from '../repositories/userRepository';
import { createNewUser } from '../services/users';
// import { UserData } from '../types';
import { newUser, loginUser, infoProfile } from './test_helper';

const api = supertest(app);

jest.setTimeout(10000);

let loginRes = <supertest.Response>{};

// const initLoggedUser = async () => {
// 	const user = await findUserByUsername(newUser.username);
// 	const activationCode = user?.activationCode;
// 	await api.get(`/api/users/activate/${activationCode}`).expect(200);
// 	const activeUser = await findUserByUsername('matcha');
// 	if (!activeUser) fail();
// 	expect(activeUser.isActive).toBe(true);
// 	const res = await api
// 		.post('/api/login')
// 		.send(loginUser)
// 		.expect(200)
// 		.expect('Content-Type', /application\/json/);
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// 	const sessions = await findSessionsByUserId(res.body.id);
// 	expect(sessions).toBeTruthy();
// 	expect(sessions?.length).toBe(1);
// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
// 	expect(res.body).toHaveProperty('token');
// 	return res;
// };

const initLoggedUser = async () => {
	const user = await findUserByUsername(newUser.username);
	const activationCode = user?.activationCode;
	await api.get(`/api/users/activate/${activationCode}`);
	const res = await api.post('/api/login').send(loginUser).expect(200);
	return res;
};

describe('check access to profile page', () => {
	let id = <string>'';
	beforeAll(async () => {
		await clearUsers();
		await createNewUser(newUser);
		loginRes = await initLoggedUser();
		id = <string>JSON.parse(loginRes.text).id;
	});
	test('logged user can visit profile page', async () => {
		const resFromProfilePage = await api
			.get(`/api/profile/${id}`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body).toBeTruthy();
		expect(resFromProfilePage.text).toContain('lorem');
	});
	test('not logged user cannot access profile page', async () => {
		const resFromProfilePage = await api
			.get(`/api/profile/${id}`)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('Access denied, no token provided');
	});
	test('should fail when no id in request', async () => {
		const resFromProfilePage = await api
			.get(`/api/profile`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(404);
		expect(resFromProfilePage.body.error).toContain('Unknown endpoint');
	});
	test('should fail request with wrong id in request', async () => {
		const resFromProfilePage = await api
			.get(`/api/profile/11111111`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(400);
		expect(resFromProfilePage.body.error).toContain('No rights to get profile data');
	});
	test('fails when no session in db', async () => {
		await clearSessions();
		const resFromProfilePage = await api
			.get(`/api/profile/${id}`)
			.set({ Authorization: `bearer ${loginRes.body.token}` })
			.expect(401)
			.expect('Content-Type', /application\/json/);

		expect(resFromProfilePage.body.error).toContain('No sessions found');
	});
});

describe('Check responses and requests to api/profile', () => {
	let resFromProfile = <supertest.Response>{};
	let id = <string>'';
	const getResFromProfile = async (res: supertest.Response) => {
		return await api
			.get(`/api/profile/${id}`)
			.set({ Authorization: `bearer ${res.body.token}` })
			.expect(200);
	};
	beforeAll(async () => {
		await clearUsers();
		await createNewUser(newUser);
		loginRes = await initLoggedUser();
		id = <string>JSON.parse(loginRes.text).id;
		resFromProfile = await getResFromProfile(loginRes);
	});
	describe('Check repsonse of GET to /api/profile', () => {
		const putToProfile = async () => {
			await api
				.put(`/api/profile/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(infoProfile)
				.expect(200);
			// 	if (res.body.error)
			// 		console.log(res.body.error);
		};

		test('should respond with baseUser + id on 1st access', () => {
			expect(resFromProfile.body).toBeTruthy();
			expect(resFromProfile.text).toContain('lorem');

			expect(JSON.parse(resFromProfile.text)).toEqual({
				id: id,
				username: 'matcha',
				email: 'matcha@test.com',
				firstname: 'lorem',
				lastname: 'ipsum'
			});
			// console.log(JSON.parse(resFromProfile.text));
		});

		test('should respond with UserData on 2nd+ access', async () => {
			//const id = <string>JSON.parse(loginRes.text).id;
			await putToProfile();
			const newResFromProfile = await getResFromProfile(loginRes);
			expect(newResFromProfile.body).toBeTruthy();
			expect(JSON.parse(newResFromProfile.text)).toEqual({ ...infoProfile, id: id });
			// console.log(JSON.parse(resFromProfile.text));
		});
	});

	describe('Check PUT requests to api/profile ', () => {
		test('should succeed with code(201)', async () => {
			await api
				.put(`/api/profile/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(infoProfile)
				.expect(200);
			const newResFromProfile = await getResFromProfile(loginRes);
			expect(newResFromProfile.body).toBeTruthy();
			expect(JSON.parse(newResFromProfile.text)).toEqual({ ...infoProfile, id: id });
		});

		it.each([
			[{ ...infoProfile, username: undefined }, 'Missing username'],
			[{ ...infoProfile, email: undefined }, 'Missing email'],
			[{ ...infoProfile, firstname: undefined }, 'Missing first name'],
			[{ ...infoProfile, lastname: undefined }, 'Missing last name'],
			[{ ...infoProfile, birthday: undefined }, 'Missing birthay date'],
			[{ ...infoProfile, gender: undefined }, 'Missing gender'],
			[{ ...infoProfile, orientation: undefined }, 'Missing orientation'],
			[{ ...infoProfile, bio: undefined }, 'Missing bio'],

			[{ ...infoProfile, username: '			' }, 'Missing username'],
			[{ ...infoProfile, username: 'mat' }, 'Username is too short'],
			[{ ...infoProfile, username: 'matcmatchamatchamatchaha' }, 'Username is too long'], //22chars
			[{ ...infoProfile, username: 'tes<3>' }, 'Invalid username'],
			[{ ...infoProfile, username: 'te st' }, 'Invalid username'],
			[{ ...infoProfile, username: 'te	st' }, 'Invalid username'],
			[{ ...infoProfile, username: 'te{st' }, 'Invalid username']
		])(`put fails with missing profile payload values`, async (invalidInputs, expectedErrorMessage) => {
			const res = await api
				.put(`/api/profile/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...infoProfile, username: '			' }, 'Missing username'],
			[{ ...infoProfile, username: 'mat' }, 'Username is too short'],
			[{ ...infoProfile, username: 'matcmatchamatchamatchaha' }, 'Username is too long'], //22chars
			[{ ...infoProfile, username: 'tes<3>' }, 'Invalid username'],
			[{ ...infoProfile, username: 'te st' }, 'Invalid username'],
			[{ ...infoProfile, username: 'te	st' }, 'Invalid username'],
			[{ ...infoProfile, username: 'te{st' }, 'Invalid username']
		])(`put fails with misformatted username`, async (invalidInputs, expectedErrorMessage) => {
			const res = await api
				.put(`/api/profile/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...infoProfile, email: '			' }, 'Missing email'],
			[{ ...infoProfile, email: 'mat' }, 'Invalid email'],
			[{ ...infoProfile, email: 'aalleex2222@yango' }, 'Invalid email'],
			[{ ...infoProfile, email: 1 }, 'Missing email'],
			[{ ...infoProfile, email: '@yangoo' }, 'Invalid email'],
			[{ ...infoProfile, email: '@hive.fi' }, 'Invalid email']
			// [{ ...infoProfile, email: 'a@hive.fi' }, 'Invalid email'],
			// [{ ...infoProfile, email: 'allex@hive.fi' }, 'Invalid email'],
		])(`put fails with misformatted email`, async (invalidInputs, expectedErrorMessage) => {
			const res = await api
				.put(`/api/profile/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		it.each([
			[{ ...infoProfile, birthday: '11-03-b' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '32/09/1999' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '28/09/1999' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: 1999 }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1999-13-23' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1999-10-32' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1999-10-32' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1900-01-00' }, 'Invalid birthday'],
			[{ ...infoProfile, birthday: '1899-12-31' }, 'Maximum age is exceeded'],
			[{ ...infoProfile, birthday: '2004-11-15' }, 'User must be at least 18'],
			[{ ...infoProfile, birthday: '1999-0003-03' }, 'User must be at least 18'],
			[{ ...infoProfile, birthday: '2004-11-16' }, 'User must be at least 18'],
			[{ ...infoProfile, birthday: new Date('1900-01-01').toISOString() }, 'Invalid birthday']
			// [{ ...infoProfile, birthday: '1999-03-22' }, 'Invalid birthday'],
			// [{ ...infoProfile, email: 'a@hive.fi' }, 'Invalid email'],
			// [{ ...infoProfile, email: 'allex@hive.fi' }, 'Invalid email'],
		])(`put fails with misformatted birthday`, async (invalidInputs, expectedErrorMessage) => {
			const res = await api
				.put(`/api/profile/${id}`)
				.set({ Authorization: `bearer ${loginRes.body.token}` })
				.send(invalidInputs)
				.expect(400)
				.expect('Content-Type', /application\/json/);
			// console.log(res.body.error);
			expect(res.body.error).toContain(expectedErrorMessage);
		});
		//create tests for uniquness
	});
});
