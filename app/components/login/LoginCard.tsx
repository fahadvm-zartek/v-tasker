'use client';

import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useRef, useState } from 'react';

import AppToast from '../AppToast';
import LoginField from './LoginField';
import LoginLogo from './LoginLogo';

const validateEmail = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Email is required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return 'Please enter a valid email address.';
  }

  return '';
};

const validatePassword = (value: string) => {
  if (!value) {
    return 'Password is required.';
  }

  return '';
};

const LoginCard = () => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({ email: false, password: false });
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const PasswordIcon = isPasswordVisible ? EyeOff : Eye;
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const isEmailReady = touchedFields.email && !emailError;
  const isPasswordReady = touchedFields.password && !passwordError;
  const emailMessage = touchedFields.email ? emailError : '';
  const passwordMessage = touchedFields.password ? passwordError : '';
  const emailFieldState = emailMessage ? 'error' : isEmailReady ? 'success' : 'default';
  const passwordFieldState = passwordMessage ? 'error' : isPasswordReady ? 'success' : 'default';
  const isFormValid = !emailError && !passwordError;

  const syncAutofillValues = () => {
    const nextEmail = emailRef.current?.value ?? '';
    const nextPassword = passwordRef.current?.value ?? '';

    if (nextEmail) {
      setEmail(nextEmail);
      setTouchedFields((current) => ({ ...current, email: true }));
    }

    if (nextPassword) {
      setPassword(nextPassword);
      setTouchedFields((current) => ({ ...current, password: true }));
    }
  };

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(syncAutofillValues);
    const timeout = window.setTimeout(syncAutofillValues, 350);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, []);

  const handleEmailInput = (event: FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
    setTouchedFields((current) => ({ ...current, email: true }));
  };

  const handlePasswordInput = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
    setTouchedFields((current) => ({ ...current, password: true }));
  };

  const handleEmailBlur = () => {
    setTouchedFields((current) => ({ ...current, email: true }));
  };

  const handlePasswordBlur = () => {
    setTouchedFields((current) => ({ ...current, password: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      setTouchedFields({ email: true, password: true });
      return;
    }

    setIsSubmitting(true);
    setToastMessage('Welcome back, Admin User.');
    window.localStorage.setItem('v-tasker-authenticated', 'true');

    window.setTimeout(() => {
      router.push('/');
    }, 650);
  };

  return (
    <>
      {toastMessage ? (
        <AppToast title="Signed in" message="Welcome back, Admin User." onDismiss={() => setToastMessage('')} />
      ) : null}

      <section
        aria-labelledby="login-title"
        className="w-full max-w-[410px] rounded-[21px] border border-[#ece8e2] bg-white px-6 pb-7 pt-8 shadow-[0_22px_56px_rgba(27,48,97,0.16)] sm:px-8"
      >
      <LoginLogo />

      <div className="mt-5 text-center">
        <h1 id="login-title" className="text-[19px] font-bold leading-7 text-[#1B3061]">
          Welcome Back
        </h1>
        <p className="mt-1.5 text-[11px] leading-4 text-[#6d6a66]">
          Sign in to continue to V Tasker.
        </p>
      </div>

      <form className="mt-6" action="#" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <LoginField
            id="email"
            label="Email Address"
            type="email"
            value={email}
            autoComplete="email"
            icon={<Mail size={14} strokeWidth={2} />}
            inputRef={emailRef}
            message={emailMessage}
            validationState={emailFieldState}
            onBlur={handleEmailBlur}
            onChange={(event) => setEmail(event.currentTarget.value)}
            onInput={handleEmailInput}
          />
          <LoginField
            id="password"
            label="Password"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            autoComplete="current-password"
            icon={<Lock size={14} strokeWidth={2} />}
            inputRef={passwordRef}
            message={passwordMessage}
            validationState={passwordFieldState}
            onBlur={handlePasswordBlur}
            onChange={(event) => setPassword(event.currentTarget.value)}
            onInput={handlePasswordInput}
          >
            <button
              type="button"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              aria-pressed={isPasswordVisible}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-[#1B3061] transition-colors hover:bg-[#E68A2E]/10 hover:text-[#E68A2E]"
              onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
            >
              <PasswordIcon aria-hidden="true" size={13} strokeWidth={2} />
            </button>
          </LoginField>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3 text-[10px]">
          <label htmlFor="remember" className="flex items-center gap-2 text-[#5f5b56]">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-3.5 w-3.5 rounded-[4px] border-[#ded9d2] bg-white accent-[#E68A2E]"
            />
            <span>Remember me</span>
          </label>
          <a href="/forgot-password" className="font-semibold text-[#1B3061] transition-colors hover:text-[#E68A2E]">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="mt-6 flex h-[37px] w-full items-center justify-center rounded-[11px] bg-[#1B3061] text-[11px] font-semibold text-white shadow-[0_11px_19px_rgba(27,48,97,0.26)] transition-all duration-200 hover:bg-[#14244d] hover:shadow-[0_13px_22px_rgba(27,48,97,0.32)] focus:outline-none focus:ring-4 focus:ring-[#1B3061]/25 disabled:cursor-not-allowed disabled:opacity-65 disabled:shadow-none"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 border-t border-[#ece8e2]" />
      </section>
    </>
  );
};

export default LoginCard;
