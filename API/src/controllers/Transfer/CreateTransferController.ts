import { Request, Response } from "express";
import { CreateTransferService } from "../../services/Transfer/CreateTransferService";

export class CreateTransferController {
	async handle(request, response: Response) {
		const user_id = request.userId;
		const { description, origin_acc_id, destiny_acc_id, amount } = request.body;

		const service = new CreateTransferService();

		const result = await service.execute({description, user_id, origin_acc_id, destiny_acc_id, amount,});

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);
	}
}
