import { Response } from "express";
import { EditTransactionService } from "../../services/Transaction/EditTransactionService";

export class EditTransactionController {
	async handle(request, response: Response) {

		const {id} = request.params;
		const user_id = request.userId;
		const { description, type, amount, status, transaction_date} = request.body;

		const service = new EditTransactionService();

		const result = await service.execute({ id, description, type, amount, status, user_id, transaction_date});

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);

	}
}
