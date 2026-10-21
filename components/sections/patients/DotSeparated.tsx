import { Fragment } from 'react';

export function DotSeparated({ parts }: { parts: string[] }) {
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <span>•</span>}
          <span>{part}</span>
        </Fragment>
      ))}
    </>
  );
}