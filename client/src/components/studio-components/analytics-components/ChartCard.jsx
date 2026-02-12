/* eslint-disable react/prop-types */
const ChartCard = ({ title, children, className = "" }) => {
    return (
      <div className={`bg-surface-card rounded-xl p-5 ${className}`}>
        <h3 className="text-lg font-semibold text-content-primary mb-4">{title}</h3>
        {children}
      </div>
    )
  }

  export default ChartCard
