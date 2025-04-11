export default function SplashScreen({ fadeOut }) {
    return (
      <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
        <p>Loading AudioNest...</p>
      </div>
    );
  }
  