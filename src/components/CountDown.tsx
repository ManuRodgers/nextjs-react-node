import { Typography } from 'antd';
import React, { FC, memo, useEffect, useState } from 'react';
const { Text } = Typography;

type CountDownProps = { time?: number; onFinish: () => void };

const CountDown: FC<CountDownProps> = ({ time, onFinish }): JSX.Element => {
  const [count, setCount] = useState<number>(time || 5);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => (count -= 1));
    }, 1000);
    if (count === 0) {
      clearInterval(timer);
      onFinish && onFinish();
    }
    return () => clearInterval(timer);
  }, [count, onFinish]);

  return (
    <Text strong style={{ color: '#40a9ff' }}>
      {count}
    </Text>
  );
};
export default memo(CountDown);
