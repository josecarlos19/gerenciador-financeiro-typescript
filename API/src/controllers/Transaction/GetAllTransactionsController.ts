import { Request, Response } from "express";
import { GetAllTransactionsService } from "../../services/Transaction/GetAllTransactionsService";

export class GetAllTransactionsController {
	async handle(request: Request, response: Response) {

		const {id} = request.body;

		const service = new GetAllTransactionsService();

		const results = await service.execute(id);

		return response.json(results);
	}
}
