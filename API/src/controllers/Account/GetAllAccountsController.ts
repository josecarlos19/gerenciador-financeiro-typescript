import { Response } from "express";
import { GetAllAccountsService } from "../../services/Account/GetAllAccountsService";

export class GetAllAccountsController {
	async handle(request, response: Response) {
		const id = request.userId;

		const service = new GetAllAccountsService();

		const results = await service.execute(id);

		return response.json(results);
	}
}
