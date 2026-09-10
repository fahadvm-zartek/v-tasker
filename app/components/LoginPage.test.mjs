import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = async (path) => {
  try {
    return await readFile(new URL(path, import.meta.url), 'utf8');
  } catch {
    return '';
  }
};

test('login route composes reusable screenshot-matched components', async () => {
  const [pageSource, indexSource] = await Promise.all([
    readSource('../login/page.tsx'),
    readSource('./login/index.ts'),
  ]);

  assert.match(pageSource, /<LoginBackground>/);
  assert.match(pageSource, /<LoginCard\s*\/>/);
  assert.match(indexSource, /LoginBackground/);
  assert.match(indexSource, /LoginCard/);
  assert.match(indexSource, /LoginField/);
  assert.match(indexSource, /LoginLogo/);
});

test('login card reproduces the visible form content and controls', async () => {
  const cardSource = await readSource('./login/LoginCard.tsx');

  assert.match(cardSource, /Welcome Back/);
  assert.match(cardSource, /Sign in to continue to V Tasker\./);
  assert.match(cardSource, /Email Address/);
  assert.match(cardSource, /Password/);
  assert.match(cardSource, /Remember me/);
  assert.match(cardSource, /Forgot Password\?/);
  assert.match(cardSource, /Sign In/);
  assert.match(cardSource, /type="submit"/);
  assert.doesNotMatch(cardSource, /placeholder=/);
  assert.doesNotMatch(cardSource, /name@company\.com/);
});

test('login fields use navy leading icons without placeholders', async () => {
  const [cardSource, fieldSource] = await Promise.all([
    readSource('./login/LoginCard.tsx'),
    readSource('./login/LoginField.tsx'),
  ]);

  assert.match(cardSource, /Mail/);
  assert.match(cardSource, /Lock/);
  assert.match(cardSource, /icon=\{<Mail/);
  assert.match(cardSource, /icon=\{<Lock/);
  assert.match(fieldSource, /text-\[#1B3061\]/);
  assert.match(fieldSource, /aria-hidden="true"/);
  assert.doesNotMatch(fieldSource, /placeholder/);
});

test('login validates email and password live and prevents invalid submission', async () => {
  const cardSource = await readSource('./login/LoginCard.tsx');

  assert.match(cardSource, /validateEmail/);
  assert.match(cardSource, /Please enter a valid email address\./);
  assert.match(cardSource, /Email is required\./);
  assert.match(cardSource, /Password is required\./);
  assert.match(cardSource, /onInput=\{handleEmailInput\}/);
  assert.match(cardSource, /onInput=\{handlePasswordInput\}/);
  assert.match(cardSource, /onBlur=\{handleEmailBlur\}/);
  assert.match(cardSource, /onBlur=\{handlePasswordBlur\}/);
  assert.match(cardSource, /disabled=\{!isFormValid \|\| isSubmitting\}/);
  assert.match(cardSource, /event\.preventDefault\(\)/);
  assert.match(cardSource, /validationState=\{emailFieldState\}/);
  assert.match(cardSource, /validationState=\{passwordFieldState\}/);
  assert.match(cardSource, /autoComplete="email"/);
  assert.match(cardSource, /autoComplete="current-password"/);
});

test('successful login shows a success toast and redirects to dashboard', async () => {
  const [cardSource, toastSource] = await Promise.all([
    readSource('./login/LoginCard.tsx'),
    readSource('./AppToast.tsx').catch(() => ''),
  ]);

  assert.match(cardSource, /useRouter/);
  assert.match(cardSource, /const router = useRouter\(\)/);
  assert.match(cardSource, /Signed in/);
  assert.match(cardSource, /Welcome back, Admin User\./);
  assert.match(cardSource, /<AppToast/);
  assert.match(cardSource, /title="Signed in"/);
  assert.match(cardSource, /message="Welcome back, Admin User\."/);
  assert.match(cardSource, /onDismiss=\{\(\) => setToastMessage\(''\)\}/);
  assert.match(toastSource, /bg-\[#ecfdf5\]/);
  assert.match(toastSource, /border-\[#6ee7b7\]/);
  assert.match(cardSource, /router\.push\('\/'\)/);
  assert.doesNotMatch(cardSource, /router\.push\('\/profile'\)/);
  assert.doesNotMatch(cardSource, /window\.location/);
  assert.doesNotMatch(cardSource, /alert\(/);
  assert.doesNotMatch(cardSource, /Swal|sweetalert/i);
});

test('login keeps invalid submissions on the login form', async () => {
  const cardSource = await readSource('./login/LoginCard.tsx');

  assert.match(cardSource, /if \(!isFormValid\) \{/);
  assert.match(cardSource, /event\.preventDefault\(\)/);
  assert.match(cardSource, /return;/);
});

test('login password visibility control uses eye icons and toggles the field type', async () => {
  const cardSource = await readSource('./login/LoginCard.tsx');

  assert.match(cardSource, /Eye/);
  assert.match(cardSource, /EyeOff/);
  assert.match(cardSource, /useState/);
  assert.match(cardSource, /type=\{isPasswordVisible \? 'text' : 'password'\}/);
  assert.match(cardSource, /aria-label=\{isPasswordVisible \? 'Hide password' : 'Show password'\}/);
  assert.match(cardSource, /bg-transparent/);
  assert.match(cardSource, /text-\[#1B3061\]/);
  assert.match(cardSource, /hover:text-\[#E68A2E\]/);
});

test('login styling follows the official orange and navy brand system', async () => {
  const [backgroundSource, cardSource, fieldSource, globalStylesSource] = await Promise.all([
    readSource('./login/LoginBackground.tsx'),
    readSource('./login/LoginCard.tsx'),
    readSource('./login/LoginField.tsx'),
    readSource('../globals.css'),
  ]);

  assert.match(backgroundSource, /min-h-screen/);
  assert.match(backgroundSource, /bg-\[#f7f7f5\]/);
  assert.match(backgroundSource, /bg-\[#1B3061\]/);
  assert.match(backgroundSource, /bg-\[#E68A2E\]/);
  assert.doesNotMatch(backgroundSource, /#08285f|#f39a2b|#edf3fb/);
  assert.match(cardSource, /w-full max-w-\[310px\]/);
  assert.match(cardSource, /rounded-\[21px\]/);
  assert.match(cardSource, /border border-\[#ece8e2\]/);
  assert.match(cardSource, /bg-white/);
  assert.match(cardSource, /shadow-\[0_22px_56px_rgba\(27,48,97,0\.16\)\]/);
  assert.match(cardSource, /text-\[#1B3061\]/);
  assert.match(cardSource, /bg-\[#1B3061\]/);
  assert.match(cardSource, /hover:bg-\[#14244d\]/);
  assert.doesNotMatch(cardSource, /#08285f|#0c3478|#1f2937/);
  assert.match(fieldSource, /h-\[37px\]/);
  assert.match(fieldSource, /rounded-\[11px\]/);
  assert.match(fieldSource, /border-\[#ded9d2\]/);
  assert.match(fieldSource, /bg-white/);
  assert.match(fieldSource, /auth-input h-full min-w-0 flex-1 bg-transparent px-3/);
  assert.match(fieldSource, /focus-within:border-\[#1B3061\]/);
  assert.match(fieldSource, /focus-within:ring-\[#E68A2E\]\/20/);
  assert.match(fieldSource, /border-\[#dc2626\]/);
  assert.match(fieldSource, /border-\[#E68A2E\]/);
  assert.match(fieldSource, /text-\[#dc2626\]/);
  assert.match(fieldSource, /auth-input/);
  assert.match(globalStylesSource, /\.auth-input:-webkit-autofill/);
  assert.match(globalStylesSource, /box-shadow: none/);
  assert.match(globalStylesSource, /-webkit-background-clip: text/);
  assert.match(globalStylesSource, /background-clip: text/);
  assert.match(globalStylesSource, /transition: background-color 9999s ease-in-out 0s/);
  assert.match(globalStylesSource, /-webkit-text-fill-color: #1B3061/);
  assert.doesNotMatch(globalStylesSource, /-webkit-box-shadow: 0 0 0 1000px/);
  assert.doesNotMatch(globalStylesSource, /#e8f0fe/);
  assert.doesNotMatch(backgroundSource + cardSource + fieldSource + globalStylesSource, /zoom:|transform: scale|scale-\[/);
});

test('login logo uses the provided project logo asset', async () => {
  const logoSource = await readSource('./login/LoginLogo.tsx');

  assert.match(logoSource, /from 'next\/image'/);
  assert.match(logoSource, /src="\/logo\.png"/);
  assert.match(logoSource, /alt="V Tasker logo"/);
  assert.match(logoSource, /width=\{50\}/);
  assert.match(logoSource, /height=\{50\}/);
  assert.match(logoSource, /unoptimized/);
  assert.match(logoSource, /h-\[50px\] w-\[50px\]/);
  assert.doesNotMatch(logoSource, /v-tasker-logo\.svg/);
});

test('login forgot password link opens the reset page route', async () => {
  const cardSource = await readSource('./login/LoginCard.tsx');

  assert.match(cardSource, /from 'next\/link'/);
  assert.match(cardSource, /<Link[^>]+href="\/forgot-password"/);
  assert.doesNotMatch(cardSource, /<a[^>]+href="\/forgot-password"/);
  assert.match(cardSource, /href="\/forgot-password"/);
  assert.match(cardSource, /Forgot Password\?/);
});

test('forgot password route uses the shared auth background and reset card', async () => {
  const [pageSource, indexSource] = await Promise.all([
    readSource('../forgot-password/page.tsx'),
    readSource('./login/index.ts'),
  ]);

  assert.match(pageSource, /<LoginBackground>/);
  assert.match(pageSource, /<ForgotPasswordCard\s*\/>/);
  assert.match(indexSource, /ForgotPasswordCard/);
});

test('forgot password card matches the visible reset form content', async () => {
  const cardSource = await readSource('./login/ForgotPasswordCard.tsx');

  assert.match(cardSource, /Reset Password/);
  assert.match(cardSource, /Enter your email address and we'll send you a/);
  assert.match(cardSource, /link to reset your password\./);
  assert.match(cardSource, /Email Address/);
  assert.match(cardSource, /Send Reset Link/);
  assert.match(cardSource, /Back to Sign In/);
  assert.match(cardSource, /href="\/login"/);
  assert.match(cardSource, /type="submit"/);
});

test('forgot password card validates email live and prevents invalid submission', async () => {
  const cardSource = await readSource('./login/ForgotPasswordCard.tsx');

  assert.match(cardSource, /'use client'/);
  assert.match(cardSource, /validateResetEmail/);
  assert.match(cardSource, /Email is required\./);
  assert.match(cardSource, /Please enter a valid email address\./);
  assert.match(cardSource, /onInput=\{handleEmailInput\}/);
  assert.match(cardSource, /onBlur=\{handleEmailBlur\}/);
  assert.match(cardSource, /disabled=\{!isFormValid\}/);
  assert.match(cardSource, /event\.preventDefault\(\)/);
  assert.match(cardSource, /validationState=\{emailFieldState\}/);
  assert.match(cardSource, /autoComplete="email"/);
});

test('forgot password card uses the login page visual system', async () => {
  const cardSource = await readSource('./login/ForgotPasswordCard.tsx');

  assert.match(cardSource, /LoginLogo/);
  assert.match(cardSource, /LoginField/);
  assert.match(cardSource, /w-full max-w-\[310px\]/);
  assert.match(cardSource, /rounded-\[21px\]/);
  assert.match(cardSource, /border border-\[#ece8e2\]/);
  assert.match(cardSource, /bg-white/);
  assert.match(cardSource, /px-6 pb-7 pt-8/);
  assert.match(cardSource, /shadow-\[0_22px_56px_rgba\(27,48,97,0\.16\)\]/);
  assert.match(cardSource, /text-\[19px\] font-bold leading-7/);
  assert.match(cardSource, /text-\[11px\] leading-4/);
  assert.match(cardSource, /className="mt-6"/);
  assert.match(cardSource, /mt-6 flex h-\[37px\]/);
  assert.match(cardSource, /bg-\[#1B3061\]/);
  assert.match(cardSource, /text-\[11px\] font-semibold/);
  assert.doesNotMatch(cardSource, /max-w-\[410px\]/);
  assert.doesNotMatch(cardSource, /h-\[45px\]/);
  assert.doesNotMatch(cardSource, /h-\[40px\]/);
});
