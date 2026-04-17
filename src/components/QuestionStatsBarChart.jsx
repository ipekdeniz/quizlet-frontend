import ReactApexChart from 'react-apexcharts';

const CHART_OPTIONS = {
  chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
  colors: ['#4ecdc4', '#c9a96e', '#e05c5c'],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 4,
      columnWidth: '45%',
      dataLabels: { position: 'top' },
    },
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: { colors: ['#181c32'], fontFamily: 'Syne, system-ui, sans-serif' },
    formatter: (val) => Math.round(val),
  },
  xaxis: {
    categories: ['Multiple Choice', 'True / False', 'Written'],
    labels: { style: { colors: 'var(--kt-text-muted)' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    forceNiceScale: true,
    labels: {
      style: { colors: 'var(--kt-text-muted)' },
      formatter: (v) => Math.round(v),
    },
  },
  grid: { borderColor: 'var(--kt-border-color)' },
  legend: { show: false },
  tooltip: { theme: 'dark' },
};

export default function QuestionStatsBarChart({ stats }) {
  const isEmpty = !stats || stats.total === 0;

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-header-title">
          <i className="bi bi-bar-chart-fill me-2" style={{ color: 'var(--kt-primary)' }} />
          Question Types - Count
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
            series={[{ name: 'Count', data: [stats.multiple_choice, stats.true_false, stats.written] }]}
            type="bar"
            height={280}
          />
        </div>
      )}
    </div>
  );
}