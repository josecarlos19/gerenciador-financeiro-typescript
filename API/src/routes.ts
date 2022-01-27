import { Router } from "express";
import { CreateAccountController } from "./controllers/Account/CreateAccountController";
import { DeleteAccountController } from "./controllers/Account/DeleteAccountController";
import { EditAccountController } from "./controllers/Account/EditAccountController";
import { ShowAccountController } from "./controllers/Account/ShowAccountController";
import { GetAllAccountsController } from "./controllers/Account/GetAllAccountsController";
import { CreateSessionController } from "./controllers/Session/CreateSessionController";
import { CreateUserController } from "./controllers/User/CreateUserController";
import { EditUserController } from "./controllers/User/EditUserController";
import { GetAllUsersController } from "./controllers/User/GetAllUsersController";
import { auth } from "./middlewares/auth";
import { CreateTransactionController } from "./controllers/Transaction/CreateTransactionController";
import { GetAllTransactionsController } from "./controllers/Transaction/GetAllTransactionsController";
import { ShowTransactionController } from "./controllers/Transaction/ShowTransactionController";
import { EditTransactionController } from "./controllers/Transaction/EditTransactionController";
import { DeleteTransactionController } from "./controllers/Transaction/DeleteTransactionController";
import { GetAllTransfersController } from "./controllers/Transfer/GetAllTransfersController";
import { CreateTransferController } from "./controllers/Transfer/CreateTransferController";
import { ShowTransferController } from "./controllers/Transfer/ShowTransferController";
import { EditTransferController } from "./controllers/Transfer/EditTransferController";
import { DeleteTransferController } from "./controllers/Transfer/DeleteTransferController";
import { GetBalanceController } from "./controllers/Balance/GetBalanceController";

const routes = Router();

routes.post("/users", new CreateUserController().handle);
routes.put("/users/:id", new EditUserController().handle);
routes.get("/users", new GetAllUsersController().handle);

routes.post("/sessions", new CreateSessionController().handle);

routes.use("/accounts", auth);
routes.post("/accounts", new CreateAccountController().handle);
routes.get("/accounts/", new GetAllAccountsController().handle);
routes.get("/accounts/:id", new ShowAccountController().handle);
routes.put("/accounts/:id", new EditAccountController().handle);
routes.delete("/accounts/:id", new DeleteAccountController().handle);

routes.use("/transactions", auth);
routes.post("/transactions", new CreateTransactionController().handle);
routes.get("/transactions", new GetAllTransactionsController().handle);
routes.get("/transactions/:id", new ShowTransactionController().handle);
routes.put("/transactions/:id", new EditTransactionController().handle);
routes.delete("/transactions/:id", new DeleteTransactionController().handle);

routes.use("/transfers", auth);
routes.get("/transfers", new GetAllTransfersController().handle);
routes.post("/transfers", new CreateTransferController().handle);
routes.get("/transfers/:id", new ShowTransferController().handle);
routes.put("/transfers/:id", new EditTransferController().handle);
routes.delete("/transfers/:id", new DeleteTransferController().handle);

routes.use("/balance", auth);
routes.get("/balance", new GetBalanceController().handle);

export { routes };
