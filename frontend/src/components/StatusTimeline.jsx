export const STATUS_FLOW = [
  "ORDER_RECEIVED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED"
];

const StatusTimeline = ({ currentStatus }) => (
  <ol className="space-y-3">
    {STATUS_FLOW.map((status, index) => {
      const currentIndex = STATUS_FLOW.indexOf(currentStatus);
      const isActive = index <= currentIndex;
      return (
        <li
          key={status}
          className={`rounded-lg border p-3 text-sm ${
            isActive
              ? "border-brand-600 bg-brand-50 text-brand-700"
              : "border-stone-200 text-stone-500"
          }`}
        >
          {status.replaceAll("_", " ")}
        </li>
      );
    })}
  </ol>
);

export default StatusTimeline;
