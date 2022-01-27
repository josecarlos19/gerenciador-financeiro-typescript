import { Response } from "express";
import { ShowAccountService } from "../../services/Account/ShowAccountService";

export class ShowAccountController {
	async handle(request, response: Response) {

		const { id } = request.params;
		const user_id = request.userId;

		const service = new ShowAccountService();

		const result = await service.execute(user_id, id);

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);
	}
}
