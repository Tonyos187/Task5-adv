import "./SignIn.module.css";
import AuthForm from "../../components/AuthForm/AuthForm";

function SignIn() {
  return (
    <AuthForm
      type="signin"
      title="Sign In"
      subtitle="Enter your credentials to access your account"
      submitButtonText="SIGN IN"
      redirectText="Don't have an account?"
      redirectLink="/SignUp"
      redirectLinkText="Create one"
    />
  );
}

export default SignIn;