/**
 * DashboardHeader — greeting + date strip at the top of the Dashboard.
 */

interface DashboardHeaderProps {
  displayName: string;
}

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = (): string =>
  new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const DashboardHeader = ({ displayName }: DashboardHeaderProps) => (
  <div className="db-header">
    <div className="db-header__greeting">
      <h1 className="db-header__title">
        {getGreeting()}, <span className="db-header__name">{displayName}</span>&nbsp;👋
      </h1>
      <p className="db-header__date">{formatDate()}</p>
    </div>
  </div>
);

export default DashboardHeader;
