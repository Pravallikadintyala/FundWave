import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page" role="main">
      <div className="not-found-page__inner page-enter">
        {/* Decorative grid */}
        <div className="not-found-page__grid" aria-hidden="true">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="not-found-page__cell" />
          ))}
        </div>

        <div className="not-found-page__content">
          <p className="not-found-page__code">404</p>
          <h1 className="not-found-page__title">Page not found</h1>
          <p className="not-found-page__desc">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-page__actions">
            <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            <Button variant="ghost" size="md" onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
