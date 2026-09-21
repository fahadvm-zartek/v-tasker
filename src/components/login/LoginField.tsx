import type {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  ReactNode,
  Ref,
} from 'react';

type ValidationState = 'default' | 'error' | 'success';

type LoginFieldProps = {
  id: string;
  label: string;
  type?: 'email' | 'password' | 'text';
  value?: string;
  autoComplete?: string;
  icon: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  message?: string;
  validationState?: ValidationState;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onInput?: FormEventHandler<HTMLInputElement>;
  children?: ReactNode;
};

const LoginField = ({
  id,
  label,
  type = 'text',
  value,
  autoComplete,
  icon,
  inputRef,
  message,
  validationState = 'default',
  onBlur,
  onChange,
  onInput,
  children,
}: LoginFieldProps) => {
  const fieldStateClass = {
    default: 'border-[#ded9d2] focus-within:border-[#1B3061] focus-within:ring-[#E68A2E]/20',
    error: 'border-[#dc2626] focus-within:border-[#dc2626] focus-within:ring-[#dc2626]/15',
    success: 'border-[#E68A2E] focus-within:border-[#1B3061] focus-within:ring-[#E68A2E]/20',
  }[validationState];

  const messageClass = validationState === 'error' ? 'text-[#dc2626]' : 'text-[#1B3061]/70';
  const messageId = message ? `${id}-message` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[10px] font-semibold leading-3 text-[#1B3061]">
        {label}
      </label>
      <div className={`flex h-[37px] items-center rounded-[11px] border bg-white transition-all duration-200 focus-within:bg-white focus-within:ring-4 ${fieldStateClass}`}>
        <span aria-hidden="true" className="flex h-full w-9 shrink-0 items-center justify-center text-[#1B3061]">
          {icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          name={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          aria-invalid={validationState === 'error'}
          aria-describedby={messageId}
          className="auth-input h-full min-w-0 flex-1 bg-transparent px-3 pl-0 text-[11px] text-[#1B3061] outline-none"
          onBlur={onBlur}
          onChange={onChange}
          onInput={onInput}
        />
        {children ? (
          <div className="flex h-full shrink-0 items-center px-2.5 text-[9px] text-[#1B3061]">
            {children}
          </div>
        ) : null}
      </div>
      <p id={messageId} className={`min-h-[14px] pt-1 text-[9px] leading-3 ${messageClass}`}>
        {message}
      </p>
    </div>
  );
};

export default LoginField;
