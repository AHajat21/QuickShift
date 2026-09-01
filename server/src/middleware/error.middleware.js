export const prismaErrorHandler = (err, req, res, next) => {
	console.error(err)

	if (err.code === "P2002") {
		return res.status(409).json({
			message: "A record with this value already exists"
		})
	}
	else if (err.code === "P2025") {
		return res.status(404).json({
			message: "Not found"
		})
	}

	return res.status(500).json({
		message: "Internal server error"
	})
}