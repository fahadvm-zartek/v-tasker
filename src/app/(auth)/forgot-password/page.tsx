import { ForgotPasswordCard, LoginBackground, LoginFooter } from '../../../components/login';

export default function ForgotPasswordPage() {
  return (
    <LoginBackground footer={<LoginFooter />}>
      <ForgotPasswordCard />
    </LoginBackground>
  );
}
