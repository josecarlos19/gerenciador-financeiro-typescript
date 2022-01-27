import { Request, Response } from "express";
import { getAllTransfersService } from "../../services/Transfer/GetAllTransfersService";

export class GetAllTransfersController {
	async handle(request, response: Response) {

		const user_id = request.userId;

		const service = new getAllTransfersService();

		const results = await service.execute(user_id);

		return response.json(results);
	}
}
