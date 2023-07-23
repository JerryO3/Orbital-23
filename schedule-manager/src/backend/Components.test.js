// import { act, render, fireEvent, screen } from "@testing-library/react";
// import * as p from "../pages/pages";
// import App from '../components/App';
// import userEvent from '@testing-library/user-event';
// import ReactDOM from 'react-dom/client';

// if (!window.Symbol) { window.Symbol = {}; }

// const test1 = test('renders landing page and buttons when not logged in', () => {
//     render(<App />);
//     const loginButton = screen.getByTestId("navLogin");
//     const registerButton = screen.getByTestId("navRegister");
//     const feedbackButton = screen.getByTestId("feedbackButton");
//     expect(loginButton.href).toContain("/login");
//     expect(registerButton.href).toContain("/register");
//     expect(feedbackButton.href).toContain("https://forms.gle/VcJ2aqPUm1octQ8C9");    
// });

// const test2 = test('renders landing page and buttons when logged in', () => {
//     const a = 
//     {"uid":"N0cfVfAknhXMVXhMuA8oY51OLot1","email":"jieruioon@gmail.com","emailVerified":true,"displayName":"Oon Jie Rui","isAnonymous":false,"photoURL":"https://lh3.googleusercontent.com/a/AAcHTtcvjx4CkHk8pGlPxr84ypOdT5nn5aWFXxmNAFcp=s96-c","providerData":[{"providerId":"google.com","uid":"106575792657294230311","displayName":"Oon Jie Rui","email":"jieruioon@gmail.com","phoneNumber":null,"photoURL":"https://lh3.googleusercontent.com/a/AAcHTtcvjx4CkHk8pGlPxr84ypOdT5nn5aWFXxmNAFcp=s96-c"}],"stsTokenManager":{"refreshToken":"APZUo0RUGozRIqRAvATmmX86XkzPlAnCbjtxGlEBXctqXAEUp59YZ1462JUgW9SdaUN6cOsA0EWNHBY1GWohh23JS6heusq4pF_nkNAzWrxgRwXRm6FVmFH99bXoQjB464AvwrAdMSQApP3P_qP0nWMjGWGlp15WboSIyABSq5QUho22smyt_kbtMEkVaXU2WGHUhdALy3cLeX0cM2mdEx-88p68rjJ-krZQdR52rVinVDHx5Q8Oda4HwTWu-OuH1fr-s2KUo2Eo89T1T3RnWrLdwoutVHUO8zcT3QLYULwjFu_Yg5Ifxw1r97lHO39R30vvgC7M7Shg2_MaEn_kY3mNYsYAElE3OMHmHBJbA9y3br2Z6SM7EXDwguBUW-xsE6NCS074EIu0LbvJPu-nbyufZMz_6awTWyZZmzSVUA3WlBvcX83Mc9tYDmkiznHQR-5qYmeKjZ_H","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkMDNhZTdmNDczZjJjNmIyNTI3NmMwNjM2MGViOTk4ODdlMjNhYTkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiT29uIEppZSBSdWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y3ZqeDRDa0hrOHBHbFB4cjg0eXBPZFQ1bm41YVdGWHhtTkFGY3A9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2NoZWR1bGUtbWFuYWdlci05NDU3OSIsImF1ZCI6InNjaGVkdWxlLW1hbmFnZXItOTQ1NzkiLCJhdXRoX3RpbWUiOjE2ODczNDM4NzgsInVzZXJfaWQiOiJOMGNmVmZBa25oWE1WWGhNdUE4b1k1MU9Mb3QxIiwic3ViIjoiTjBjZlZmQWtuaFhNVlhoTXVBOG9ZNTFPTG90MSIsImlhdCI6MTY4NzY2NjE2NCwiZXhwIjoxNjg3NjY5NzY0LCJlbWFpbCI6ImppZXJ1aW9vbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwNjU3NTc5MjY1NzI5NDIzMDMxMSJdLCJlbWFpbCI6WyJqaWVydWlvb25AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.UAN_CWkv65J05B3wFp-Pbd2x-pesuto-HRDQK7nfepzCv3dLI-9gQs6HRHLNMI-b9DrNRe2iDjHPb47tkCOzBTjuNadypxfi5EBb1frILysFHW8SSLhGvXmboeIE3_jnuJRKLrFgNnbmNoPxtAOBimSJxFx1W83gpEpmh8h-y-cepcjcY7jTowZHpSHntgWXNHFv52ypOaVvcwcbbJEPDULiKiEIqRzMT0-AGg2TLuBgyaKrb9SlMiMGsslfxFLWlhbZrvBG32fi6Z43lEaRzmPzLgoXx5qMSCDVgXhGNGyP537inpz5_RxbgZYeQ8mU41LRup3M0luGy12-pkFQUA","expirationTime":1687669760780},"createdAt":"1687343828059","lastLoginAt":"1687343877450","apiKey":"AIzaSyAt_7XlSnzjPny4ehAjLhFqqIebvAV_v9s","appName":"[DEFAULT]"};

//     const b = JSON.stringify(a);
//     localStorage.setItem('user', b)

//     render(<App />);
//     const settingsButton = screen.getByTestId("navSettings");
//     const homeButton = screen.getByTestId("navHome");
//     const feedbackButton = screen.getByTestId("feedbackButton");
//     expect(settingsButton.href).toContain("/settings");
//     expect(homeButton.href).toContain("/dashboard");
//     expect(feedbackButton.href).toContain("https://forms.gle/VcJ2aqPUm1octQ8C9");   
//     const logoutButton = screen.getByTestId("navLogout");
//     fireEvent.click(logoutButton);
//     expect(window.location.href).toBe("http://localhost/");
//     render(<App />);
//     const loginButton = screen.getByTestId("navLogin");
//     const registerButton = screen.getByTestId("navRegister");
//     expect(loginButton.href).toContain("/login");
//     expect(registerButton.href).toContain("/register");
// });

// const test3 = test('login page', () => {
//     localStorage.removeItem("user");
//     render(<App />);
//     const loginButton = screen.getByTestId("navLogin");
//     fireEvent.click(loginButton);
//     expect(window.location.href).toBe("http://localhost/login")
//     const emailBox = screen.getByTestId("emailForm");
//     const pwBox = screen.getByTestId("pwForm");
//     const loginSubmit = screen.getByTestId("loginSubmit");

//     // act(() => {
//     userEvent.type(emailBox, "test@mail.com");
//     // });

//     expect(screen.getByTestId("emailForm").value)
//     .toContain("test@mail.com");

//     // act(() => {
//     userEvent.type(pwBox, "4321qwer");
//     // });

//     expect(screen.getByTestId("pwForm").value)
//     .toContain("4321qwer");

//     fireEvent.click(loginSubmit)

//     expect(localStorage["user"]).toBe();
// }) 

// const test4 = test('Dashboard', async () => {
//     const a = 
//     {"uid":"N0cfVfAknhXMVXhMuA8oY51OLot1","email":"jieruioon@gmail.com","emailVerified":true,"displayName":"Oon Jie Rui","isAnonymous":false,"photoURL":"https://lh3.googleusercontent.com/a/AAcHTtcvjx4CkHk8pGlPxr84ypOdT5nn5aWFXxmNAFcp=s96-c","providerData":[{"providerId":"google.com","uid":"106575792657294230311","displayName":"Oon Jie Rui","email":"jieruioon@gmail.com","phoneNumber":null,"photoURL":"https://lh3.googleusercontent.com/a/AAcHTtcvjx4CkHk8pGlPxr84ypOdT5nn5aWFXxmNAFcp=s96-c"}],"stsTokenManager":{"refreshToken":"APZUo0RUGozRIqRAvATmmX86XkzPlAnCbjtxGlEBXctqXAEUp59YZ1462JUgW9SdaUN6cOsA0EWNHBY1GWohh23JS6heusq4pF_nkNAzWrxgRwXRm6FVmFH99bXoQjB464AvwrAdMSQApP3P_qP0nWMjGWGlp15WboSIyABSq5QUho22smyt_kbtMEkVaXU2WGHUhdALy3cLeX0cM2mdEx-88p68rjJ-krZQdR52rVinVDHx5Q8Oda4HwTWu-OuH1fr-s2KUo2Eo89T1T3RnWrLdwoutVHUO8zcT3QLYULwjFu_Yg5Ifxw1r97lHO39R30vvgC7M7Shg2_MaEn_kY3mNYsYAElE3OMHmHBJbA9y3br2Z6SM7EXDwguBUW-xsE6NCS074EIu0LbvJPu-nbyufZMz_6awTWyZZmzSVUA3WlBvcX83Mc9tYDmkiznHQR-5qYmeKjZ_H","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkMDNhZTdmNDczZjJjNmIyNTI3NmMwNjM2MGViOTk4ODdlMjNhYTkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiT29uIEppZSBSdWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y3ZqeDRDa0hrOHBHbFB4cjg0eXBPZFQ1bm41YVdGWHhtTkFGY3A9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2NoZWR1bGUtbWFuYWdlci05NDU3OSIsImF1ZCI6InNjaGVkdWxlLW1hbmFnZXItOTQ1NzkiLCJhdXRoX3RpbWUiOjE2ODczNDM4NzgsInVzZXJfaWQiOiJOMGNmVmZBa25oWE1WWGhNdUE4b1k1MU9Mb3QxIiwic3ViIjoiTjBjZlZmQWtuaFhNVlhoTXVBOG9ZNTFPTG90MSIsImlhdCI6MTY4NzY2NjE2NCwiZXhwIjoxNjg3NjY5NzY0LCJlbWFpbCI6ImppZXJ1aW9vbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwNjU3NTc5MjY1NzI5NDIzMDMxMSJdLCJlbWFpbCI6WyJqaWVydWlvb25AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.UAN_CWkv65J05B3wFp-Pbd2x-pesuto-HRDQK7nfepzCv3dLI-9gQs6HRHLNMI-b9DrNRe2iDjHPb47tkCOzBTjuNadypxfi5EBb1frILysFHW8SSLhGvXmboeIE3_jnuJRKLrFgNnbmNoPxtAOBimSJxFx1W83gpEpmh8h-y-cepcjcY7jTowZHpSHntgWXNHFv52ypOaVvcwcbbJEPDULiKiEIqRzMT0-AGg2TLuBgyaKrb9SlMiMGsslfxFLWlhbZrvBG32fi6Z43lEaRzmPzLgoXx5qMSCDVgXhGNGyP537inpz5_RxbgZYeQ8mU41LRup3M0luGy12-pkFQUA","expirationTime":1687669760780},"createdAt":"1687343828059","lastLoginAt":"1687343877450","apiKey":"AIzaSyAt_7XlSnzjPny4ehAjLhFqqIebvAV_v9s","appName":"[DEFAULT]"};

//     const b = JSON.stringify(a);
//     localStorage.setItem('user', b)

//     render(<p.Dashboard />);
//     screen.getAllByTestId("calendar")
//     screen.getAllByTestId("projs")
//     screen.getAllByTestId("blockouts")
// })

// const test5 = test('Settings', async () => {
//     const a = 
//     {"uid":"N0cfVfAknhXMVXhMuA8oY51OLot1","email":"jieruioon@gmail.com","emailVerified":true,"displayName":"Oon Jie Rui","isAnonymous":false,"photoURL":"https://lh3.googleusercontent.com/a/AAcHTtcvjx4CkHk8pGlPxr84ypOdT5nn5aWFXxmNAFcp=s96-c","providerData":[{"providerId":"google.com","uid":"106575792657294230311","displayName":"Oon Jie Rui","email":"jieruioon@gmail.com","phoneNumber":null,"photoURL":"https://lh3.googleusercontent.com/a/AAcHTtcvjx4CkHk8pGlPxr84ypOdT5nn5aWFXxmNAFcp=s96-c"}],"stsTokenManager":{"refreshToken":"APZUo0RUGozRIqRAvATmmX86XkzPlAnCbjtxGlEBXctqXAEUp59YZ1462JUgW9SdaUN6cOsA0EWNHBY1GWohh23JS6heusq4pF_nkNAzWrxgRwXRm6FVmFH99bXoQjB464AvwrAdMSQApP3P_qP0nWMjGWGlp15WboSIyABSq5QUho22smyt_kbtMEkVaXU2WGHUhdALy3cLeX0cM2mdEx-88p68rjJ-krZQdR52rVinVDHx5Q8Oda4HwTWu-OuH1fr-s2KUo2Eo89T1T3RnWrLdwoutVHUO8zcT3QLYULwjFu_Yg5Ifxw1r97lHO39R30vvgC7M7Shg2_MaEn_kY3mNYsYAElE3OMHmHBJbA9y3br2Z6SM7EXDwguBUW-xsE6NCS074EIu0LbvJPu-nbyufZMz_6awTWyZZmzSVUA3WlBvcX83Mc9tYDmkiznHQR-5qYmeKjZ_H","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkMDNhZTdmNDczZjJjNmIyNTI3NmMwNjM2MGViOTk4ODdlMjNhYTkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiT29uIEppZSBSdWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y3ZqeDRDa0hrOHBHbFB4cjg0eXBPZFQ1bm41YVdGWHhtTkFGY3A9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2NoZWR1bGUtbWFuYWdlci05NDU3OSIsImF1ZCI6InNjaGVkdWxlLW1hbmFnZXItOTQ1NzkiLCJhdXRoX3RpbWUiOjE2ODczNDM4NzgsInVzZXJfaWQiOiJOMGNmVmZBa25oWE1WWGhNdUE4b1k1MU9Mb3QxIiwic3ViIjoiTjBjZlZmQWtuaFhNVlhoTXVBOG9ZNTFPTG90MSIsImlhdCI6MTY4NzY2NjE2NCwiZXhwIjoxNjg3NjY5NzY0LCJlbWFpbCI6ImppZXJ1aW9vbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwNjU3NTc5MjY1NzI5NDIzMDMxMSJdLCJlbWFpbCI6WyJqaWVydWlvb25AZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.UAN_CWkv65J05B3wFp-Pbd2x-pesuto-HRDQK7nfepzCv3dLI-9gQs6HRHLNMI-b9DrNRe2iDjHPb47tkCOzBTjuNadypxfi5EBb1frILysFHW8SSLhGvXmboeIE3_jnuJRKLrFgNnbmNoPxtAOBimSJxFx1W83gpEpmh8h-y-cepcjcY7jTowZHpSHntgWXNHFv52ypOaVvcwcbbJEPDULiKiEIqRzMT0-AGg2TLuBgyaKrb9SlMiMGsslfxFLWlhbZrvBG32fi6Z43lEaRzmPzLgoXx5qMSCDVgXhGNGyP537inpz5_RxbgZYeQ8mU41LRup3M0luGy12-pkFQUA","expirationTime":1687669760780},"createdAt":"1687343828059","lastLoginAt":"1687343877450","apiKey":"AIzaSyAt_7XlSnzjPny4ehAjLhFqqIebvAV_v9s","appName":"[DEFAULT]"};

//     const b = JSON.stringify(a);
//     localStorage.setItem('user', b)

//     render(<p.Settings />);

//     const handleForm = screen.getByTestId("handleForm")
//     // act(() => {
//     userEvent.type(handleForm, "lol");
//     // });

//     expect(screen.getByTestId("handleForm").value)
//     .toContain("lol");

//     const nameForm = screen.getByTestId("nameForm")
//     // act(() => {
//     userEvent.type(nameForm, "JerryO10");
//     // });

//     expect(screen.getByTestId("nameForm").value)
//     .toContain("JerryO10");

//     const submit = screen.getByTestId("submitButton")
//     fireEvent.click(submit)
// })

// const test6 = test('Register', async () => {
//     localStorage.removeItem("user");
//     render(<App />);
//     const regButton = screen.getByTestId("navRegister");
//     fireEvent.click(regButton);
//     expect(window.location.href).toBe("http://localhost/register")

//     const usernameForm = screen.getByTestId("usernameForm")
//     // act(() => {
//     userEvent.type(usernameForm, "username");
//     // });

//     expect(screen.getByTestId("usernameForm").value)
//     .toContain("username");

//     const emailForm = screen.getByTestId("emailForm")
//     // act(() => {
//     userEvent.type(emailForm, "email@gmail.com");
//     // });

//     expect(screen.getByTestId("emailForm").value)
//     .toContain("email@gmail.com");

//     const pwForm = screen.getByTestId("pwForm")
//     // act(() => {
//     userEvent.type(pwForm, "qwer1234");
//     // });

//     expect(screen.getByTestId("pwForm").value)
//     .toContain("qwer1234");

//     const cnfmForm = screen.getByTestId("cnfmForm")
//     // act(() => {
//     userEvent.type(cnfmForm, "qwer1234");
//     // });

//     expect(screen.getByTestId("cnfmForm").value)
//     .toContain("qwer1234");

//     const submitButton = screen.getByTestId("submitButton")
//     fireEvent.click(submitButton)
// })