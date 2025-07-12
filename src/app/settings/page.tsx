import { PageHeader } from '@/components/page-header';
import { SettingsClientPage } from './settings-client-page';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Settings" />
      <main className="p-4 sm:p-6">
        <SettingsClientPage />
      </main>
    </div>
  );
}
