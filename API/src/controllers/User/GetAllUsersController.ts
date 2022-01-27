import { Request, Response } from "express";
import { GetAllUsersService } from "../../services/User/GetAllUsersService";

export class GetAllUsersController {
	async handle(request: Request, response: Response) {

		const service = new GetAllUsersService();

		const results = service.execute();

		return response.json(results);
	}
}
