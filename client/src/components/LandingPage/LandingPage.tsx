import './LandingPage.css';
import ParallaxText from './Parallax';
import LandingPaper from './LandingPaper';

const LandingPage = () => {
	return (
		<div className="landing-background">
			<section className="landing-text">
				<ParallaxText baseVelocity={-2}>Find your love on matcha ♥ </ParallaxText>
				<ParallaxText baseVelocity={2}>Matcha ♥ Matcha ♥ Matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={-2}>Find your love on matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={2}>Matcha ♥ Matcha ♥ Matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={-2}>Find your love on matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={2}>Matcha ♥ Matcha ♥ Matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={-2}>Find your love on matcha ♥</ParallaxText>
				<LandingPaper />
				<ParallaxText baseVelocity={2}>Matcha ♥ Matcha ♥ Matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={-2}>Find your love on matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={2}>Matcha ♥ Matcha ♥ Matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={-2}>Find your love on matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={2}>Matcha ♥ Matcha ♥ Matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={-2}>Find your love on matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={2}>Matcha ♥ Matcha ♥ Matcha ♥</ParallaxText>
				<ParallaxText baseVelocity={-2}>Find your love on matcha ♥</ParallaxText>
			</section>
			<div className="dotted" />
		</div>
	);
};

export default LandingPage;
