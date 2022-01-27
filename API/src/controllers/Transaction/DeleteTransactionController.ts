import { Response } from "express";
import { DeleteTransactionService } from "../../services/Transaction/DeleteTransactionService";

export class DeleteTransactionController {
	async handle(request, response: Response) {

		const {id} = request.params;
		const user_id = request.userId;

		const service = new DeleteTransactionService();

		const result = await service.execute(id, user_id);

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(204).end();
	}
}
