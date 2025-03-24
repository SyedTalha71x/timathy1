/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Tooltip, Space } from 'antd';

const VariablePicker = ({ variables, onInsert }) => {
  return (
    <div className="mb-2">
      <Space wrap>
        {variables.map((variable) => (
          <Tooltip key={variable.value} title={`Insert ${variable.label}`}>
            <Button
              size="small"
              type="dashed"
              onClick={() => onInsert(variable.value)}
              style={{ borderColor: '#6366f1', color: '#6366f1' }}
            >
              {variable.label}
            </Button>
          </Tooltip>
        ))}
      </Space>
    </div>
  );
};

export default VariablePicker;