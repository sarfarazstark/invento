import Sidebar from '@/components/sidebar';
import { AccountSettings } from '@stackframe/stack';

export default function SettingsPage() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Sidebar currentPath='/settings' />

      <main className='ml-64'>
        <div className='bg-white !text-gray-900 height-screen'>
          <AccountSettings fullPage={true} />
        </div>
      </main>
    </div>
  );
}
