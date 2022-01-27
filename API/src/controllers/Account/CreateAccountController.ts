import { Response } from "express";
import { CreateAccountService } from "../../services/Account/CreateAccountService";

export class CreateAccountController {
	async handle(request, response: Response) {

		const user_id = request.userId;
		const { name } = request.body;

		const service = new CreateAccountService();

		const result = await service.execute({ name, user_id });

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);
	}
}
