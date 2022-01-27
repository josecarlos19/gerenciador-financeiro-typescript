const isOwnerAccount = async (id_1:string, id_2: string) => {

	if (id_1 == id_2) {
		return true;
	} else {
		return false;
	}

};
export {isOwnerAccount};
