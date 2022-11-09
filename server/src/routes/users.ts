import express from 'express';
import asyncHandler from 'express-async-handler';
import { AppError } from '../errors';
import { findPasswordResetRequestByToken } from '../repositories/passwordResetRequestRepository';
import { getAllUsers } from '../repositories/userRepository';
import { activateAccount, createNewUser, sendActivationCode, sendResetLink, changeUserPassword } from '../services/users';
import { parseNewUserPayload, parseEmail, validateToken, validatePassword } from '../validators/userPayloadValidators';

const router = express.Router();

//rm later
router.get(
	'/',
	asyncHandler(async (_req, res) => {
		const result = await getAllUsers();
		console.log(result);
		res.send(result);
	})
);

// create user
router.post(
	'/',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const newUser = parseNewUserPayload(req.body);
		const createdUser = await createNewUser(newUser);
		sendActivationCode(createdUser);
		res.status(201).json(createdUser);
	})
);

//activate
router.get(
	'/activate/:id',
	asyncHandler(async (req, res) => {
		await activateAccount(req.params.id);
		res.status(200).end();
	})
);

//forgot pwd request from email form
router.post(
	'/forgot_password',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const email = parseEmail(req.body.email);
		await sendResetLink(email);
		res.status(201).end();
	})
);

router.get(
	'/forgot_password/',
	asyncHandler(() => {
		throw new AppError('Missing activation code', 400);
	})
);

router.get(
	'/forgot_password/:id',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const token = validateToken(req.params.id);
		const passwordResetRequsest = await findPasswordResetRequestByToken(token);
		if (!passwordResetRequsest) {
			throw new AppError('Invalid reset link. Please try again.', 400);
		}
		res.status(200).end();
	})
);

router.post(
	'/forgot_password/:id',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const token = validateToken(req.params.id);
		const passwordResetRequest = await findPasswordResetRequestByToken(token);
		if (!passwordResetRequest) {
			throw new AppError('Reset password code is missing or expired. Please try again.', 400);
		}
		const password = validatePassword(req.body.password);
		await changeUserPassword(passwordResetRequest.userId, password);
		res.status(200).end();

	})
);

export default router;
