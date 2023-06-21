import { render, fireEvent, screen } from "@testing-library/react";
import * as p from "../pages/pages";
import userEvent from '@testing-library/user-event';

test("Log in from Landing Page", () => {
    render(<p.Login />)

    const emailBox = screen.getByTestId("emailForm");
    userEvent.type(emailBox, "test@mail.com");

    expect(screen.getByTestId("emailForm"))
    .toHaveValue("test@mail.com");
})
