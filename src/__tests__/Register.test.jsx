import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/Register";

// Mocka useNavigate först
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mocka AuthContext
const mockRegister = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

describe("Register", () => {
  beforeEach(() => {
    // Rensa alla mock-anrop innan varje test
    vi.clearAllMocks();
  });

  it("renders the register form", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Namn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lösenord/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Skapa konto/i })
    ).toBeInTheDocument();
  });

  it("calls register when form is submitted", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Namn/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Lösenord/i);
    const submitButton = screen.getByRole("button", { name: /Skapa konto/i });

    // Fyll i formuläret
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@test.se" } });
    fireEvent.change(passwordInput, { target: { value: "1234" } });

    // Submitta formuläret genom att klicka på knappen
    fireEvent.click(submitButton);

    // Kolla att register anropades med rätt parametrar
    expect(mockRegister).toHaveBeenCalledWith(
      "test@test.se",
      "1234",
      "Test User"
    );
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });
});
