import styles from "./LoadingPage.module.css"

const LoadingPage = () => {
	return (
		<div className={styles.loadingPage}>
			<div className={styles.loadingCard}>
				<div className={styles.spinner}>
					<div className={styles.spinnerRing} />
				</div>

				<h1 className={styles.loadingTitle}>Please wait</h1>

				<p className={styles.loadingMessage}>Loading...</p>
			</div>
		</div>
	)
}

export default LoadingPage