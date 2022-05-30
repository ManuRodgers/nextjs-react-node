import { formatDistanceToNow, parseISO } from 'date-fns';
import React, { FC, memo } from 'react';

type TimeAgoProps = { timestamp: string };

const TimeAgo: FC<TimeAgoProps> = ({ timestamp }): JSX.Element => {
  let timeAgo = '';
  if (timestamp) {
    const timePeriod = formatDistanceToNow(parseISO(timestamp));
    timeAgo = `${timePeriod} ago`;
  }
  return (
    <span title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  );
};
export default memo(TimeAgo);
