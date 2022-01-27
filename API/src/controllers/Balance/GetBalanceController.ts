import { Response } from "express";
import { GetBalanceService } from "../../services/Balance/GetBalanceService";

export class GetBalanceController {
	async handle(request, response: Response) {

		const userId = request.userId;

		const service = new GetBalanceService();

		const result = await service.execute(userId);

		return response.status(200).json(result);
	}
}
