'use client';

import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';

import LoginField from './LoginField';
import LoginLogo from './LoginLogo';

const validateResetEmail = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Email is required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return 'Please enter a valid email address.';
  }

  return '';
};

const ForgotPasswordCard = () => {
  const [email, setEmail] = useState('');
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const emailError = validateResetEmail(email);
  const isEmailReady = isEmailTouched && !emailError;
  const emailMessage = isEmailTouched ? emailError : '';
  const emailFieldState = emailMessage ? 'error' : isEmailReady ? 'success' : 'default';
  const isFormValid = !emailError;

  const syncAutofillValue = () => {
    const nextEmail = emailRef.current?.value ?? '';

    if (nextEmail) {
      setEmail(nextEmail);
      setIsEmailTouched(true);
    }
  };

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(syncAutofillValue);
    const timeout = window.setTimeout(syncAutofillValue, 350);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, []);

  const handleEmailInput = (event: FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
    setIsEmailTouched(true);
  };

  const handleEmailBlur = () => {
    setIsEmailTouched(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!isFormValid) {
      event.preventDefault();
      setIsEmailTouched(true);
    }
  };

  return (
    <section
      aria-labelledby="reset-title"
      className="w-full max-w-[410px] rounded-[21px] border border-[#ece8e2] bg-white px-6 pb-7 pt-8 shadow-[0_22px_56px_rgba(27,48,97,0.16)] sm:px-8"
    >
      <LoginLogo />

      <div className="mt-5 text-center">
        <h1 id="reset-title" className="text-[19px] font-bold leading-7 text-[#1B3061]">
          Reset Password
        </h1>
        <p className="mt-1.5 text-[11px] leading-4 text-[#6d6a66]">
          {"Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      <form className="mt-6" action="#" onSubmit={handleSubmit}>
        <LoginField
          id="reset-email"
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

        <button
          type="submit"
          disabled={!isFormValid}
          className="mt-6 flex h-[37px] w-full items-center justify-center rounded-[11px] bg-[#1B3061] text-[11px] font-semibold text-white shadow-[0_11px_19px_rgba(27,48,97,0.26)] transition-all duration-200 hover:bg-[#14244d] hover:shadow-[0_13px_22px_rgba(27,48,97,0.32)] focus:outline-none focus:ring-4 focus:ring-[#1B3061]/25 disabled:cursor-not-allowed disabled:opacity-65 disabled:shadow-none"
        >
          Send Reset Link
        </button>
      </form>

      <div className="mt-6 flex justify-center border-t border-[#ece8e2] pt-5">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#1B3061] transition-colors hover:text-[#E68A2E]"
        >
          <ArrowLeft size={11} strokeWidth={2.2} />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </section>
  );
};

export default ForgotPasswordCard;
