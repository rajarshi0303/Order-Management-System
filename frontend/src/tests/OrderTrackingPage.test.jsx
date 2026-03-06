import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { STATUS_FLOW } from "../components/StatusTimeline.jsx";
import OrderTrackingPage from "../pages/OrderTrackingPage.jsx";

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useParams: () => ({ id: "order-1" })
  };
});

jest.mock("../hooks/useOrderTracking.js", () => ({
  useOrderTracking: () => ({
    data: {
      id: "order-1",
      status: "OUT_FOR_DELIVERY",
      estimatedTime: "30-40 mins"
    },
    isLoading: false,
    error: null
  })
}));

describe("OrderTrackingPage", () => {
  it("renders live status timeline", () => {
    render(
      <MemoryRouter>
        <OrderTrackingPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Order #order-1")).toBeInTheDocument();
    STATUS_FLOW.forEach((status) => {
      expect(screen.getByText(status.replaceAll("_", " "))).toBeInTheDocument();
    });
  });
});
