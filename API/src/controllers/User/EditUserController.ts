import { Request, Response } from "express";
import { EditUserService } from "../../services/User/EditUserService";

export class EditUserController {
	async handle(request: Request, response: Response) {

		const { id } = request.params;
		const { name, email, password } = request.body;

		const service = new EditUserService();

		const result = await service.execute({ id, name, email, password });

		if (result instanceof Error) {
			return response.status(400).json(result.message);
		}

		return response.status(200).json(result);
	}
}
