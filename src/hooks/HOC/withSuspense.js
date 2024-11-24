import { Skeleton } from "antd";
import { Suspense } from "react";

const withSuspense = (Component) => {
  return (props) => (
    <Suspense
      fallback={
        <div className="w-full">
          <Skeleton.Node active={true} className="w-full" />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspense;
