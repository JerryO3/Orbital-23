import { act, render, fireEvent, screen } from "@testing-library/react";
import * as p from "../pages/pages";
import Login from "../pages/Login";
import App from '../components/App';
import userEvent from '@testing-library/user-event';
import ReactDOM from 'react-dom/client';

// const a = test('renders the landing page', () => {
//     render(<App />);
//     const button1 = screen.getByTestId("homeLogo");
//     const button2 = screen.getByTestId("loginButton");
//     const button3 = screen.getByTestId("registerButton");
//     fireEvent.click(button1);
//     fireEvent.click(button2);
//     // fireEvent.click(button3);
//     // window.location = "/Login"
//     const emailBox = screen.getByTestId("emailForm");

//     act(() => {
//     userEvent.type(emailBox, "test@mail.com");
//     });

//     expect(screen.getByTestId("emailForm").value)
//     .toContain("test@mail.com");

//     localStorage.setItem("user", 123)
//     console.debug('Message here', screen.getByTestId("emailForm").value)
    
// });