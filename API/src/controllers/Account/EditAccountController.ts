import { Response } from "express";
import { EditAccountService } from "../../services/Account/EditAccountService";

export class EditAccountController {
	async handle(request, response: Response) {

		const {id} = request.params;
		const user_id = request.userId;
		const { name } = request.body;

		const service = new EditAccountService();

		const result = await service.execute({ id, name, user_id});

		if(result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);

	}
}
