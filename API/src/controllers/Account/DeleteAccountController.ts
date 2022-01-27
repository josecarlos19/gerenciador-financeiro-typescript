import { Response } from "express";
import { DeleteAccountService } from "../../services/Account/DeleteAccountService";

export class DeleteAccountController {
	async handle(request, response: Response) {

		const {id} = request.params;
		const user_id = request.userId;

		const service = new DeleteAccountService();

		const result =  await service.execute(id, user_id);

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(204).end();
	}
}
