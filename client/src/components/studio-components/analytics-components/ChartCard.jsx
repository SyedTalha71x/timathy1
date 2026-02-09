/* eslint-disable react/prop-types */
const ChartCard = ({ title, children, className = "" }) => {
    return (
      <div className={`bg-[#2F2F2F] rounded-xl p-5 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
      </div>
    )
  }

  export default ChartCard