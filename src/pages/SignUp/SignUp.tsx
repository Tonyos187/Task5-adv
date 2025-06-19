import "./SignUp.module.css";
import AuthForm from "../../components/AuthForm/AuthForm";

function SignUp() {
  return (
    <AuthForm
      type="signup"
      title="Sign Up"
      subtitle="Create your account to get started"
      submitButtonText="SIGN UP"
      redirectText="Do you have an account?"
      redirectLink="/SignIn"
      redirectLinkText="Sign in"

    />
  );
}

export default SignUp;