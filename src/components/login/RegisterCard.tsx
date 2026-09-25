'use client';

import { Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useRef, useState } from 'react';

import authService from '../../services/authService';
import { lettersOnly, validateName as validateRegisterName } from '../../services/nameValidation';
import AppToast from '../AppToast';
import LoginField from './LoginField';
import LoginLogo from './LoginLogo';

const { AuthApiError, register, persistAuthSession } = authService;

const validateRegisterEmail = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Email is required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return 'Please enter a valid email address.';
  }

  return '';
};

const validateRegisterPassword = (value: string) => {
  if (!value) {
    return 'Password is required.';
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  return '';
};

const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword) {
    return 'Password is required.';
  }

  if (password !== confirmPassword) {
    return 'Passwords must match.';
  }

  return '';
};

const getFieldError = (error: unknown, fieldName: string) =>
  error instanceof AuthApiError ? error.fieldErrors[fieldName] || '' : '';

const RegisterCard = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastTitle, setToastTitle] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiFieldErrors, setApiFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const firstNameError = validateRegisterName(firstName, 'First name is required.');
  const lastNameError = validateRegisterName(lastName, 'Last name is required.');
  const emailError = validateRegisterEmail(email);
  const passwordError = validateRegisterPassword(password);
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
  const firstNameMessage = touchedFields.firstName ? firstNameError || apiFieldErrors.first_name : '';
  const lastNameMessage = touchedFields.lastName ? lastNameError || apiFieldErrors.last_name : '';
  const emailMessage = touchedFields.email ? emailError || apiFieldErrors.email : '';
  const passwordMessage = touchedFields.password ? passwordError || apiFieldErrors.password1 : '';
  const confirmPasswordMessage = touchedFields.confirmPassword
    ? confirmPasswordError || apiFieldErrors.password2
    : '';
  const emailFieldState = emailMessage ? 'error' : touchedFields.email && !emailError ? 'success' : 'default';
  const passwordFieldState = passwordMessage ? 'error' : touchedFields.password && !passwordError ? 'success' : 'default';
  const confirmPasswordFieldState = confirmPasswordMessage
    ? 'error'
    : touchedFields.confirmPassword && !confirmPasswordError
      ? 'success'
      : 'default';
  const firstNameFieldState = firstNameMessage
    ? 'error'
    : touchedFields.firstName && !firstNameError
      ? 'success'
      : 'default';
  const lastNameFieldState = lastNameMessage
    ? 'error'
    : touchedFields.lastName && !lastNameError
      ? 'success'
      : 'default';
  const isFormValid = !firstNameError && !lastNameError && !emailError && !passwordError && !confirmPasswordError;

  const syncAutofillValues = () => {
    const nextFirstName = firstNameRef.current?.value ?? '';
    const nextLastName = lastNameRef.current?.value ?? '';
    const nextEmail = emailRef.current?.value ?? '';
    const nextPassword = passwordRef.current?.value ?? '';
    const nextConfirmPassword = confirmPasswordRef.current?.value ?? '';

    if (nextFirstName) {
      setFirstName(lettersOnly(nextFirstName));
      setTouchedFields((current) => ({ ...current, firstName: true }));
    }

    if (nextLastName) {
      setLastName(lettersOnly(nextLastName));
      setTouchedFields((current) => ({ ...current, lastName: true }));
    }

    if (nextEmail) {
      setEmail(nextEmail);
      setTouchedFields((current) => ({ ...current, email: true }));
    }

    if (nextPassword) {
      setPassword(nextPassword);
      setTouchedFields((current) => ({ ...current, password: true }));
    }

    if (nextConfirmPassword) {
      setConfirmPassword(nextConfirmPassword);
      setTouchedFields((current) => ({ ...current, confirmPassword: true }));
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

  const handleFirstNameInput = (event: FormEvent<HTMLInputElement>) => {
    setFirstName(lettersOnly(event.currentTarget.value));
    setApiFieldErrors((current) => ({ ...current, first_name: '' }));
    setTouchedFields((current) => ({ ...current, firstName: true }));
  };

  const handleLastNameInput = (event: FormEvent<HTMLInputElement>) => {
    setLastName(lettersOnly(event.currentTarget.value));
    setApiFieldErrors((current) => ({ ...current, last_name: '' }));
    setTouchedFields((current) => ({ ...current, lastName: true }));
  };

  const handleEmailInput = (event: FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
    setApiFieldErrors((current) => ({ ...current, email: '' }));
    setTouchedFields((current) => ({ ...current, email: true }));
  };

  const handlePasswordInput = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
    setApiFieldErrors((current) => ({ ...current, password1: '' }));
    setTouchedFields((current) => ({ ...current, password: true }));
  };

  const handleConfirmPasswordInput = (event: FormEvent<HTMLInputElement>) => {
    setConfirmPassword(event.currentTarget.value);
    setApiFieldErrors((current) => ({ ...current, password2: '' }));
    setTouchedFields((current) => ({ ...current, confirmPassword: true }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      setTouchedFields({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setIsSubmitting(true);
    setApiFieldErrors({});

    try {
      const session = await register({
        email,
        password1: password,
        password2: confirmPassword,
        first_name: firstName,
        last_name: lastName,
        user_type_name: 'ADMIN',
      });
      persistAuthSession(session);
      setToastVariant('success');
      setToastTitle('Account created');
      setToastMessage('Welcome to V Tasker.');

      window.setTimeout(() => {
        router.push('/dashboard');
      }, 650);
    } catch (error) {
      setApiFieldErrors({
        first_name: getFieldError(error, 'first_name'),
        last_name: getFieldError(error, 'last_name'),
        email: getFieldError(error, 'email'),
        password1: getFieldError(error, 'password1'),
        password2: getFieldError(error, 'password2'),
        non_field_errors: getFieldError(error, 'non_field_errors'),
      });
      setTouchedFields({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
      setToastVariant('error');
      setToastTitle('Registration failed');
      setToastMessage(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toastMessage ? (
        <AppToast title={toastTitle} message={toastMessage} variant={toastVariant} onDismiss={() => setToastMessage('')} />
      ) : null}

      <section
        aria-labelledby="register-title"
        className="w-full max-w-[310px] rounded-[21px] border border-[#ece8e2] bg-white px-6 pb-7 pt-8 shadow-[0_22px_56px_rgba(27,48,97,0.16)] sm:px-8"
      >
        <LoginLogo />

        <div className="mt-5 text-center">
          <h1 id="register-title" className="text-[19px] font-bold leading-7 text-[#1B3061]">
            Create Account
          </h1>
          <p className="mt-1.5 text-[11px] leading-4 text-[#6d6a66]">
            Register to continue to V Tasker.
          </p>
        </div>

        <form className="mt-6" action="#" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <LoginField
              id="register-first-name"
              label="First Name"
              placeholder="Enter your first name"
              type="text"
              value={firstName}
              autoComplete="given-name"
              icon={<User size={14} strokeWidth={2} />}
              inputRef={firstNameRef}
              message={firstNameMessage}
              validationState={firstNameFieldState}
              onBlur={() => setTouchedFields((current) => ({ ...current, firstName: true }))}
              onChange={(event) => setFirstName(lettersOnly(event.currentTarget.value))}
              onInput={handleFirstNameInput}
            />
            <LoginField
              id="register-last-name"
              label="Last Name"
              placeholder="Enter your last name"
              type="text"
              value={lastName}
              autoComplete="family-name"
              icon={<User size={14} strokeWidth={2} />}
              inputRef={lastNameRef}
              message={lastNameMessage}
              validationState={lastNameFieldState}
              onBlur={() => setTouchedFields((current) => ({ ...current, lastName: true }))}
              onChange={(event) => setLastName(lettersOnly(event.currentTarget.value))}
              onInput={handleLastNameInput}
            />
            <LoginField
              id="register-email"
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              value={email}
              autoComplete="email"
              icon={<Mail size={14} strokeWidth={2} />}
              inputRef={emailRef}
              message={emailMessage}
              validationState={emailFieldState}
              onBlur={() => setTouchedFields((current) => ({ ...current, email: true }))}
              onChange={(event) => setEmail(event.currentTarget.value)}
              onInput={handleEmailInput}
            />
            <LoginField
              id="register-password"
              label="Password"
              placeholder="Create a password (8+ characters)"
              type="password"
              value={password}
              autoComplete="new-password"
              icon={<Lock size={14} strokeWidth={2} />}
              inputRef={passwordRef}
              message={passwordMessage}
              validationState={passwordFieldState}
              onBlur={() => setTouchedFields((current) => ({ ...current, password: true }))}
              onChange={(event) => setPassword(event.currentTarget.value)}
              onInput={handlePasswordInput}
            />
            <LoginField
              id="register-confirm-password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              icon={<Lock size={14} strokeWidth={2} />}
              inputRef={confirmPasswordRef}
              message={confirmPasswordMessage}
              validationState={confirmPasswordFieldState}
              onBlur={() => setTouchedFields((current) => ({ ...current, confirmPassword: true }))}
              onChange={(event) => setConfirmPassword(event.currentTarget.value)}
              onInput={handleConfirmPasswordInput}
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="mt-6 flex h-[37px] w-full items-center justify-center rounded-[11px] bg-[#1B3061] text-[11px] font-semibold text-white shadow-[0_11px_19px_rgba(27,48,97,0.26)] transition-all duration-200 hover:bg-[#14244d] hover:shadow-[0_13px_22px_rgba(27,48,97,0.32)] focus:outline-none focus:ring-4 focus:ring-[#1B3061]/25 disabled:cursor-not-allowed disabled:opacity-65 disabled:shadow-none"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 flex justify-center border-t border-[#ece8e2] pt-5 text-[10px] text-[#5f5b56]">
          <span>Already have an account?</span>
          <Link href="/login" className="ml-1 font-semibold text-[#1B3061] transition-colors hover:text-[#E68A2E]">
            Sign in
          </Link>
        </div>
      </section>
    </>
  );
};

export default RegisterCard;
