import { LoginBackground, LoginCard, LoginFooter } from '../../../components/login';

export default function LoginPage() {
  return (
    <LoginBackground footer={<LoginFooter />}>
      <LoginCard />
    </LoginBackground>
  );
}
