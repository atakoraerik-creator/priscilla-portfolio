import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" />
      <section className="container-content flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="h-display">Page not found</h1>
        <p className="mt-4 max-w-md text-sm text-charcoal/70">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <Link to="/" className="btn-dark mt-8">
          Back to Home
        </Link>
      </section>
    </>
  );
}