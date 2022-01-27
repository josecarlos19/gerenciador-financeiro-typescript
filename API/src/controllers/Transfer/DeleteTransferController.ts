import { Response } from "express";
import { DeleteTransferService } from "../../services/Transfer/DeleteTransferService";

export class DeleteTransferController {
	async handle(request, response: Response) {

		const user_id = request.userId;
		const { id } = request.params;

		const service = new DeleteTransferService();

		const result = await service.execute(id, user_id);

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(204).end();
	}
}
