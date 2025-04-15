// app/account/verify-new-email/page.tsx
import { Suspense } from 'react';
import {VerifyNewEmailPage} from './verify_new_email'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <VerifyNewEmailPage />
    </Suspense>
  );
}
