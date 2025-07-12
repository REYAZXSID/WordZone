
import { AuthForm } from './auth-form';
import { PageHeader } from '@/components/page-header';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Login / Sign Up" />
      <main className="flex-1 p-4 sm:p-6 flex items-center justify-center">
        <AuthForm />
      </main>
    </div>
  );
}
