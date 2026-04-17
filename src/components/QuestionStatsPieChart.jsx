import ReactApexChart from 'react-apexcharts';

const CHART_OPTIONS = {
  chart: { type: 'donut', background: 'transparent', toolbar: { show: false } },
  labels: ['Multiple Choice', 'True / False', 'Written'],
  colors: ['#4ecdc4', '#c9a96e', '#e05c5c'],
  legend: { position: 'bottom', labels: { colors: '#e2ddd6' } },
  dataLabels: { style: { colors: ['#09090f'], fontFamily: 'Syne, system-ui, sans-serif' } },
  plotOptions: { pie: { donut: { size: '60%' } } },
  tooltip: { theme: 'dark' },
};

export default function QuestionStatsPieChart({ stats }) {
  const isEmpty = !stats || stats.total === 0;

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-header-title">
          <i className="bi bi-pie-chart me-2" style={{ color: 'var(--kt-primary)' }} />
          Question Types
        </h5>
      </div>
      {isEmpty ? (
        <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: 200 }}>
          <span style={{ fontSize: 13, color: 'var(--kt-text-muted)' }}>No questions yet</span>
        </div>
      ) : (
        <div className="card-body">
          <ReactApexChart
            options={CHART_OPTIONS}
            series={[stats.multiple_choice, stats.true_false, stats.written]}
            type="donut"
            height={280}
          />
        </div>
      )}
    </div>
  );
}
