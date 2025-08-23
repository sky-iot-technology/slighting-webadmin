import { redirect } from 'next/navigation';

export default async function Page() {
  // For now, we'll redirect to sign-in
  // In a real app, you would check authentication here
  // You can implement server-side session checking or JWT verification
  
  redirect('/auth/sign-in');
}
