import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

const auth = async (request, response, next) => {
	const authHeader = request.headers.authorization;


	if (!authHeader) {
		return response.status(401).json({ message: "Token not provided" });
	}

	const [, token] = authHeader.split(" ");

	jwt.verify(token, process.env.APP_SECRET, function(error, decoded){

		if(error){
			return response.status(401).json({message: "Invalid Token"});
		}

		const repo = getRepository(User);
		const user = repo.findOne(decoded.id);

		if(!user){
			return response.status(401).json({ message: "User not found" });
		}

		request.userId = decoded.id;

		return next();
	});

};

export{auth};
