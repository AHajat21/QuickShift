import { Link } from 'react-router'
import styles from './LandingPage.module.css'

const LandingPage = () => {
	return (
		<main className={styles.landingPage}>
			<header className={styles.navBar}>
				<Link to="/" className={styles.logo}>QuickShift</Link>
				<nav className={styles.navLinks}>
					<a href="#how-it-works">How it works</a>
					<a href="#features">Features</a>
					<a href="#about">About</a>
				</nav>

				<div className={styles.navActions}>
					<Link to="/login" className={styles.loginButton}>
						Log in
					</Link>
					<Link to="/register" className={styles.primaryButton}>
						Get Started
					</Link>
				</div>
			</header>


			<section className={styles.hero}>
				<div className={styles.heroContent}>
					<span className={styles.eyebrow}>SIMPLE SHIFT MANAGEMENT</span>
					<h1>
						Your rotas. <br />
						<span>Simpler than ever.</span>
					</h1>
					<p className={styles.heroDescription}>
						Create weekly timetables and organise employee availability in one place.
					</p>

					<div className={styles.heroActions}>
						<Link to="/register" className={styles.primaryButton}>
							Get Started <span aria-hidden="true">→</span>
						</Link>
						<a href="#features" className={styles.secondaryButton}>
							Explore Features
						</a>
					</div>

					<div className={styles.heroNote}>Built for small businesses.</div>
				</div>

				{/* <div className={styles.heroVisual}>
					<div className={styles.imagePlaceholder}>
						<div className={styles.placeholderIcon}>▦</div>
						<img
							src=""
							alt="QuickShift weekly timetable"
						/>
					</div>
					<div className={styles.floatingCard}>
						<span className={styles.floatingIcon}>✓</span>
						<div>
							<strong>One organised schedule</strong>
							<p>Your week, at a glance.</p>
						</div>
					</div>
				</div> */}
			</section>


			<section className={styles.howItWorksSection} id="how-it-works">
				<div className={styles.sectionHeading}>
					<span className={styles.eyebrow}>GETTING STARTED</span>
					<h2>Scheduling made <span>straightforward.</span> </h2>
					<p>
						Get your team's schedule organised in a few
						simple steps.
					</p>
				</div>

				<div className={styles.stepsGrid}>
					<article className={styles.stepCard}>
						<span className={styles.stepNumber}>01</span>
						<h3>Setting up your account</h3>
						<p>
							Sign up or continue as a guest.
						</p>
					</article>
					<article className={styles.stepCard}>
						<span className={styles.stepNumber}>02</span>
						<h3>Create employee profiles</h3>
						<p>
							Add your employees and their availabilities.
						</p>
					</article>
					<article className={styles.stepCard}>
						<span className={styles.stepNumber}>03</span>
						<h3>Build your timetables</h3>
						<p>
							Assign shifts using your team's availability.
						</p>
					</article>
				</div>
			</section>


			<section className={styles.featuresSection} id="features">
				<div className={styles.sectionHeading}>
					<span className={styles.eyebrow}>WHAT YOU CAN DO</span>
					<h2>
						Everything to help you <br />
						<span>manage your team's shifts.</span>
					</h2>
				</div>

				<div className={styles.featuresScroll}>
					<article className={styles.featureCard}>
						<div className={styles.featureIcon}>👥</div>
						<h3><span>✓</span> Create employees and manage availabilties</h3>
						<p>
							for each employee, each day.
						</p>
					</article>

					<article className={styles.featureCard}>
						<div className={styles.featureIcon}>📅</div>
						<h3><span>✓</span> Create your timetables intuitively</h3>
						<p>
							using your employee availabilities.
						</p>
					</article>

					<article className={styles.featureCard}>
						<div className={styles.featureIcon}>🗓️</div>
						<h3><span>✓</span>Duplicate existing timetables</h3>
						<p>
							to save time for your next timetable.
						</p>
					</article>
				</div>
			</section>


			<section className={styles.aboutSection} id="about">
					<span className={styles.eyebrow}>ABOUT QUICKSHIFT</span>
					<h2>
						Good scheduling <br />
						shouldn't be complicated.
					</h2>
					<p>
						QuickShift was created with a simple idea:
						managing a team's shifts shouldn't take more
						effort than it needs to.
					</p>
					<p>
						I'm building a straightforward way for small
						businesses to organise their employees and manage their schedules.
					</p>
					<p>
						My goal is to make shift management simpler,
						clearer and less time-consuming.
					</p>
			</section>


			<footer className={styles.footer}>
				<div className={styles.footerTop}>
					<div className={styles.footerBrand}>
						<Link to="/" className={styles.logo}>QuickShift</Link>
						<p>A simpler way to manage your team's shifts.</p>
					</div>

					<div className={styles.footerLinks}>
						<div>
							<h4>Explore</h4>
							<a href="#features">Features</a>
							<a href="#how-it-works">How it works</a>
							<a href="#about">About</a>
						</div>

						<div>
							<h4>Account</h4>
							<Link to="/login">Log in</Link>
							<Link to="/register">Get Started</Link>
						</div>

						<div>
							<a href="mailto:ahajat60@gmail.com">ahajat60@gmail.com</a>
						</div>
					</div>
				</div>

				<div className={styles.footerBottom}>
					<p>
						© {new Date().getFullYear()} QuickShift.
						All rights reserved.
					</p>
					<p>Built to make scheduling simpler.</p>
				</div>
			</footer>

		</main>
	)
}

export default LandingPage