import { Response } from "express";
import { ShowTransactionService } from "../../services/Transaction/ShowTransactionService";

export class ShowTransactionController {
	async handle(request, response: Response) {

		const { id } = request.params;
		const user_id = request.userId;

		const service = new ShowTransactionService();

		const result = await service.execute(user_id, id);

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);
	}
}
