import { Request, Response } from "express";
import { CreateTransactionService } from "../../services/Transaction/CreateTransactionService";

export class CreateTransactionController {
	async handle(request: Request, response: Response) {

		const { description, type, amount, account_id, status, transaction_date } = request.body;

		const service = new CreateTransactionService();

		const result = await service.execute({
			description,
			type,
			amount,
			account_id,
			status,
			transaction_date
		});

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);
	}
}
