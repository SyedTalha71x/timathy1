/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Checkbox } from "antd"
import { CheckboxValueType } from "antd/es/checkbox/Group"

const CheckboxGroup = ({ options, value, onChange }) => {
  return <Checkbox.Group options={options} value={value} onChange={onChange} className="text-white" />
}

export default CheckboxGroup
