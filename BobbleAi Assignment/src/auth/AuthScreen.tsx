import React from "react";
import "./AuthScreen.scss";

import { SignUpView } from "./SignUpView";
import { notification, Divider, Button, Result } from "antd";

import { SocialLoginView, SocialUser } from "./SocialLoginView";

interface AuthScreenProps {}

type UserInfo = {
  firstName?: string;
  lastName?: string;
  email: string;
};

//data that will be sent to signup api
export type UserInfoForm = UserInfo & {
  password: string;
};

// status of reqres.in API request
const API_STATUS = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
};

type AuthStateType = {
  status: string;
  isLoggedIn: boolean;
  data: null | object;
};

export const AuthScreen: React.FC<AuthScreenProps> = React.forwardRef(
  (_, __) => {
    // holds state of auth, usually lives in redux
    const [authState, setAuthState] = React.useState<AuthStateType>({
      status: API_STATUS.IDLE,
      isLoggedIn: false,
      data: null,
    });
    const [userInput, setUserInput] = React.useState<UserInfo | null>(null);

    //Make api request to reqres.in on signup
    const onSignUpUserByForm = (user: UserInfoForm) => {
      const { firstName, lastName, email } = user;
      setAuthState({ ...authState, status: API_STATUS.LOADING });
      setUserInput({ firstName, lastName, email });
      fetch("https://reqres.in/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json()) // parse json data
        .then((data) => {
          // If error show error in notification with message
          if (data.error) {
            setAuthState({
              isLoggedIn: false,
              status: API_STATUS.REJECTED,
              data: null,
            });
            notification["error"]({
              message: "Error",
              description: data.error,
            });
          } else {
            // if success store in state
            setAuthState({
              isLoggedIn: true,
              status: API_STATUS.RESOLVED,
              data,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    // This will log out user and show sign up form again
    const onSocialLogin = (user: SocialUser) => {
      setAuthState({
        isLoggedIn: true,
        status: API_STATUS.RESOLVED,
        data: user,
      });

      setUserInput({
        firstName: user.name,
        email: user.email,
      });
    };

    // This will log out user and show sign up form again
    const onSignUpAgain = () => {
      setAuthState({ isLoggedIn: false, status: API_STATUS.IDLE, data: null });

      setUserInput(null);
    };

    return (
      <section id="authSection">
        <div id="authBox">
          {authState.isLoggedIn && (
            <SuccessView
              name={userInput?.firstName || ""}
              onSignUpAgain={onSignUpAgain}
            />
          )}
          {!authState.isLoggedIn && (
            <>
              <div className="text-center actionNameView">
                <span>SIGN UP</span>
              </div>
              {/* Labels on top */}
              <div className="text-center">
                <div className="heading">Create your account</div>
                <div className="subtitle">
                  {"Lorem ipsum dolor sit amet consectetur, adipisicing elit."}
                </div>
              </div>
              <SocialLoginView onSocialLogin={onSocialLogin} />

              <Divider>
                <span className="dividerText">or</span>
              </Divider>
              <SignUpView
                onSignUp={onSignUpUserByForm}
                loading={authState.status === API_STATUS.LOADING}
              />
            </>
          )}
        </div>
      </section>
    );
  }
);

interface SuccessViewProps {
  name: string;
  onSignUpAgain(): void;
}

const SuccessView: React.FC<SuccessViewProps> = (props) => {
  return (
    <Result
      status="success"
      title="Successfully Signed up!"
      subTitle={`Welcome onboard, ${props.name}!`}
      extra={[
        <Button key="signup" onClick={props.onSignUpAgain}>
          Sign up Again
        </Button>,
      ]}
    />
  );
};
