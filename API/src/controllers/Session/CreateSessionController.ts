import { Request, Response } from "express";
import { CreateSessionService } from "../../services/Session/CreateSessionService";

export class CreateSessionController {
	async handle(request: Request, response: Response) {

		const { email, password } = request.body;

		const service = new CreateSessionService();

		const user = await service.execute({ email, password });

		if (user instanceof Error) {
			return response.status(400).json(user.message);
		}

		return response.status(200).json({
			user,
			token: user.generateToken()
		});

	}
}
