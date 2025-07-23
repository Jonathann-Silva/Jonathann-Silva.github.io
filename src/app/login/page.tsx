import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2 text-center">
          Login
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          Acesse sua conta para gerenciar seus agendamentos.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
