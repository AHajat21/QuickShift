import styles from "./ErrorPage.module.css"

const ErrorPage = () => {
	return (
		<div className={styles.errorPage}>
			<div className={styles.errorCard}>
				<div className={styles.errorIcon} aria-hidden="true">
					!
				</div>

				<h1>Something went wrong</h1>
				<p>
					We couldn't load your data.
					Please check your connection and refresh the page to try again
				</p>
			</div>
		</div>
	)
}

export default ErrorPage