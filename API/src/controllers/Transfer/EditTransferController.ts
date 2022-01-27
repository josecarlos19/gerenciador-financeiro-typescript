import { Response } from "express";
import { EditTransferService } from "../../services/Transfer/EditTransferService";

export class EditTransferController {
	async handle(request, response: Response) {

		const { id } = request.params;
		const user_id = request.userId;
		const { description, origin_acc_id, destiny_acc_id, amount } = request.body;

		const service = new EditTransferService();

		const result = await service.execute({id,description,user_id,origin_acc_id,destiny_acc_id, amount});

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);

	}
}
