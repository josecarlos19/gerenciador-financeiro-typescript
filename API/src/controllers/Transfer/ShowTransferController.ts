import { Response } from "express";
import { ShowTransferService } from "../../services/Transfer/ShowTransferService";

export class ShowTransferController {
	async handle(request, response: Response) {

		const { id } = request.params;
		const user_id = request.userId;

		const service = new ShowTransferService();

		const result = await service.execute(id, user_id);

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);

	}
}
